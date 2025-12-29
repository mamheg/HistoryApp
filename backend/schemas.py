from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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
    created_at: datetime # Serialized to ISO string

    class Config:
        from_attributes = True

# Phase 3: Menu Schemas
class ModifierBase(BaseModel):
    modifier_type: str  # "size", "milk", "syrup"
    name: str
    price: int = 0

class ModifierCreate(ModifierBase):
    pass

class Modifier(ModifierBase):
    id: int
    product_id: int

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: int
    category_id: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    sort_order: int = 0

class ProductCreate(ProductBase):
    modifiers: Optional[list[ModifierCreate]] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    category_id: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    sort_order: Optional[int] = None

class Product(ProductBase):
    id: int
    modifiers: list[Modifier] = []

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    id: str
    name: str
    sort_order: int = 0

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    sort_order: Optional[int] = None

class Category(CategoryBase):
    products: list[Product] = []

    class Config:
        from_attributes = True

class MenuResponse(BaseModel):
    categories: list[Category]
