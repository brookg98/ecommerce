from typing import List


class EmailService:
    @staticmethod
    async def send_email(to: List[str], subject: str, body: str):
        print(f"[EMAIL] To: {to}, Subject: {subject}")
        print(f"[EMAIL] Body: {body}")

    @staticmethod
    async def send_order_confirmation(to: str, order_id: int, total_amount: float):
        subject = f"Order Confirmation - Order #{order_id}"
        body = f"""
        Thank you for your order!

        Order ID: {order_id}
        Total Amount: ${total_amount}

        We will process your order shortly.
        """
        await EmailService.send_email([to], subject, body)
