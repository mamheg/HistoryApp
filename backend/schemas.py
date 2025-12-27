from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    id: int
    name: str
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    points: int
    lifetime_points: int
    level_name: str
    next_level_points: int # Calculated field
    is_admin: bool

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    user_id: int
    items_summary: str
    total_price: int
    points_used: int
    pickup_time: Optional[str] = None
    comment: Optional[str] = None

class Order(OrderCreate):
    id: str
    points_earned: int
    created_at: str # serialized datetime

    class Config:
        from_attributes = True
