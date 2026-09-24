from enum import Enum
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


def now() -> datetime:
    """Current local time, timezone-aware (columns are TIMESTAMP WITH TIME ZONE)"""
    return datetime.now().astimezone()

# OrderStatus (Enum) -> preparing, picked_up, in_transit, delivered
class OrderStatus(str, Enum):
    PREPARING = "preparing"
    PICKED_UP = "picked_up"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"

# Database table for Orders
class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_name: str = Field(index=True)
    delivery_address: str
    items: str
    status: OrderStatus = Field(default=OrderStatus.PREPARING, index=True)
    created_at: datetime = Field(default_factory=now)
    updated_at: datetime = Field(default_factory=now)

# Schema for creating a new order
class OrderCreate(SQLModel):
    customer_name: str = Field(min_length=1)
    delivery_address: str = Field(min_length=1)
    items: str = Field(min_length=1)

# Schema for updating an order's status / address (PATCH: every field optional)
class OrderUpdate(SQLModel):
    status: Optional[OrderStatus] = None
    delivery_address: Optional[str] = Field(default=None, min_length=1)

# Database table: one row every time an order's status changes
class StatusLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id", index=True)
    old_status: str
    new_status: str
    changed_at: datetime = Field(default_factory=now)
