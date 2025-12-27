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
