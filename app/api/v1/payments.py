from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.db.models.user import User
from app.db.models.order import Order
from app.core.dependencies import get_current_user
from app.services.payment_service import PaymentService
from app.core.utils import raise_not_found
from pydantic import BaseModel

router = APIRouter(prefix="/payments", tags=["payments"])
payment_service = PaymentService()


class PaymentIntentRequest(BaseModel):
    order_id: int


class PaymentIntentResponse(BaseModel):
    client_secret: str
    payment_intent_id: str


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "payments"}


@router.post("/create-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(
    request_data: PaymentIntentRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Order).where(Order.id == request_data.order_id, Order.user_id == current_user.id)
    )
    order = result.scalar_one_or_none()

    if not order:
        raise_not_found("Order", request_data.order_id)

    if order.status != "pending":
        raise HTTPException(status_code=400, detail="Order is not in pending status")

    payment_intent = await payment_service.create_payment_intent(
        amount=float(order.total_amount),
        metadata={
            "order_id": str(order.id),
            "user_id": str(current_user.id)
        }
    )

    order.payment_intent_id = payment_intent.id
    await db.commit()

    return PaymentIntentResponse(
        client_secret=payment_intent.client_secret,
        payment_intent_id=payment_intent.id
    )


@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.body()
    signature = request.headers.get("stripe-signature")

    try:
        event = payment_service.verify_webhook_signature(payload, signature)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        order_id = payment_intent["metadata"].get("order_id")

        if order_id:
            result = await db.execute(select(Order).where(Order.id == int(order_id)))
            order = result.scalar_one_or_none()

            if order:
                order.status = "paid"
                await db.commit()

    return {"status": "success"}
