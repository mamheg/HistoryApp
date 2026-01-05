from sqlalchemy import Column, Integer, String, Boolean, BigInteger, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True) # Telegram ID
    name = Column(String, index=True)
    avatar_url = Column(String, nullable=True)
    
    # Phase 2 fields
    points = Column(Integer, default=340) 
    lifetime_points = Column(Integer, default=420)
    level_name = Column(String, default="Бариста-Шеф")
    
    is_admin = Column(Boolean, default=False)
    
    orders = relationship("Order", back_populates="user")

    @property
    def next_level_points(self):
        from utils import get_next_level_points
        return get_next_level_points(self.lifetime_points)

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True) # e.g. ORD-1234
    user_id = Column(BigInteger, ForeignKey("users.id"))
    total_price = Column(Integer)
    points_used = Column(Integer)
    points_earned = Column(Integer)
    items_summary = Column(String) # "Cappuccino x2, Cake x1"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    comment = Column(String, nullable=True)
    pickup_time = Column(String, nullable=True)

    user = relationship("User", back_populates="orders")

# Phase 3: Menu Models
class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True)  # e.g. "coffee", "breakfast"
    name = Column(String, nullable=False)
    sort_order = Column(Integer, default=0)
    
    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Integer, nullable=False)
    category_id = Column(String, ForeignKey("categories.id"))
    image_url = Column(String, nullable=True)
    video_url = Column(String, nullable=True)  # Video animation URL
    sort_order = Column(Integer, default=0)
    
    category = relationship("Category", back_populates="products")
    modifiers = relationship("ProductModifier", back_populates="product", cascade="all, delete-orphan")

class ProductModifier(Base):
    __tablename__ = "product_modifiers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    modifier_type = Column(String, nullable=False)  # "size", "milk", "syrup"
    name = Column(String, nullable=False)
    price = Column(Integer, default=0)
    
    product = relationship("Product", back_populates="modifiers")

class Favorite(Base):
    __tablename__ = "favorites"

    user_id = Column(BigInteger, ForeignKey("users.id"), primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id"), primary_key=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
