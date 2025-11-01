from pydantic import BaseModel
from typing import List
from decimal import Decimal


class CartItemAdd(BaseModel):
    product_id: int
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


class CartItem(BaseModel):
    product_id: int
    quantity: int
    unit_price: Decimal
    product_name: str


class CartResponse(BaseModel):
    items: List[CartItem]
    total: Decimal
    item_count: int
