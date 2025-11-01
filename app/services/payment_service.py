import stripe
from app.core.config import settings

stripe.api_key = settings.STRIPE_API_KEY


class PaymentService:
    @staticmethod
    async def create_payment_intent(amount: float, currency: str = "usd", metadata: dict = None):
        try:
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),
                currency=currency,
                metadata=metadata or {}
            )
            return intent
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe error: {str(e)}")

    @staticmethod
    def verify_webhook_signature(payload: bytes, signature: str) -> dict:
        try:
            event = stripe.Webhook.construct_event(
                payload, signature, settings.STRIPE_WEBHOOK_SECRET
            )
            return event
        except ValueError:
            raise Exception("Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise Exception("Invalid signature")
