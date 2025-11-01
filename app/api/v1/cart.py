from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import redis.asyncio as redis
from decimal import Decimal

from app.db.session import get_db
from app.db.models.user import User
from app.db.models.product import Product
from app.schemas.cart import CartItemAdd, CartItemUpdate, CartResponse, CartItem
from app.core.dependencies import get_current_user, get_redis
from app.core.utils import raise_not_found, raise_bad_request

router = APIRouter(prefix="/cart", tags=["cart"])


def get_cart_key(user_id: int) -> str:
    return f"cart:user:{user_id}"


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "cart"}


@router.get("", response_model=CartResponse)
async def get_cart(
    current_user: User = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis),
    db: AsyncSession = Depends(get_db)
):
    cart_key = get_cart_key(current_user.id)
    cart_data = await redis_client.hgetall(cart_key)

    items = []
    total = Decimal("0")

    for product_id_str, quantity_str in cart_data.items():
        product_id = int(product_id_str)
        quantity = int(quantity_str)

        result = await db.execute(select(Product).where(Product.id == product_id))
        product = result.scalar_one_or_none()

        if product:
            items.append(CartItem(
                product_id=product.id,
                quantity=quantity,
                unit_price=product.price,
                product_name=product.name
            ))
            total += product.price * quantity

    return CartResponse(
        items=items,
        total=total,
        item_count=len(items)
    )


@router.post("/items", status_code=201)
async def add_to_cart(
    item: CartItemAdd,
    current_user: User = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Product).where(Product.id == item.product_id))
    product = result.scalar_one_or_none()

    if not product:
        raise_not_found("Product", item.product_id)

    if product.stock < item.quantity:
        raise_bad_request("Insufficient stock")

    cart_key = get_cart_key(current_user.id)
    current_qty = await redis_client.hget(cart_key, str(item.product_id))

    new_quantity = item.quantity
    if current_qty:
        new_quantity += int(current_qty)

    if product.stock < new_quantity:
        raise_bad_request("Insufficient stock")

    await redis_client.hset(cart_key, str(item.product_id), new_quantity)
    await redis_client.expire(cart_key, 86400 * 7)

    return {"message": "Item added to cart", "product_id": item.product_id, "quantity": new_quantity}


@router.put("/items/{product_id}")
async def update_cart_item(
    product_id: int,
    item_update: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()

    if not product:
        raise_not_found("Product", product_id)

    if item_update.quantity <= 0:
        raise_bad_request("Quantity must be greater than 0")

    if product.stock < item_update.quantity:
        raise_bad_request("Insufficient stock")

    cart_key = get_cart_key(current_user.id)
    await redis_client.hset(cart_key, str(product_id), item_update.quantity)

    return {"message": "Cart item updated", "product_id": product_id, "quantity": item_update.quantity}


@router.delete("/items/{product_id}", status_code=204)
async def remove_from_cart(
    product_id: int,
    current_user: User = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    cart_key = get_cart_key(current_user.id)
    await redis_client.hdel(cart_key, str(product_id))


@router.delete("", status_code=204)
async def clear_cart(
    current_user: User = Depends(get_current_user),
    redis_client: redis.Redis = Depends(get_redis)
):
    cart_key = get_cart_key(current_user.id)
    await redis_client.delete(cart_key)
