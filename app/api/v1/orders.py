from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import redis.asyncio as redis
from typing import List
from decimal import Decimal

from app.db.session import get_db
from app.db.models.user import User
from app.db.models.order import Order, OrderItem
from app.db.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse
from app.core.dependencies import get_current_user, get_redis
from app.core.utils import raise_not_found, raise_bad_request

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "orders"}


@router.post("", response_model=OrderResponse, status_code=201)
async def create_order(
    current_user: User = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis),
    db: AsyncSession = Depends(get_db)
):
    cart_key = f"cart:user:{current_user.id}"
    cart_data = await redis_client.hgetall(cart_key)

    if not cart_data:
        raise_bad_request("Cart is empty")

    total_amount = Decimal("0")
    order_items_data = []

    for product_id_str, quantity_str in cart_data.items():
        product_id = int(product_id_str)
        quantity = int(quantity_str)

        result = await db.execute(select(Product).where(Product.id == product_id))
        product = result.scalar_one_or_none()

        if not product:
            raise_bad_request(f"Product {product_id} not found")

        if product.stock < quantity:
            raise_bad_request(f"Insufficient stock for product {product.name}")

        order_items_data.append({
            "product_id": product_id,
            "quantity": quantity,
            "unit_price": product.price,
            "product": product
        })
        total_amount += product.price * quantity

    new_order = Order(
        user_id=current_user.id,
        total_amount=total_amount,
        status="pending"
    )
    db.add(new_order)
    await db.flush()

    for item_data in order_items_data:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item_data["product_id"],
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"]
        )
        db.add(order_item)

        product = item_data["product"]
        product.stock -= item_data["quantity"]

    await db.commit()
    await db.refresh(new_order)

    await redis_client.delete(cart_key)

    result = await db.execute(
        select(Order).where(Order.id == new_order.id)
    )
    order = result.scalar_one()

    return order


@router.get("", response_model=List[OrderResponse])
async def list_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Order)
        .where(Order.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()
    return orders


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Order).where(Order.id == order_id, Order.user_id == current_user.id)
    )
    order = result.scalar_one_or_none()

    if not order:
        raise_not_found("Order", order_id)

    return order
