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
    is_admin: bool

    class Config:
        from_attributes = True
