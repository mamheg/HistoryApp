from sqlalchemy import Column, Integer, String, Boolean, BigInteger
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True) # Telegram ID
    name = Column(String, index=True)
    avatar_url = Column(String, nullable=True)
    
    # Phase 2 fields
    points = Column(Integer, default=340) # Mock default
    lifetime_points = Column(Integer, default=420)
    level_name = Column(String, default="Бариста-Шеф")
    
    is_admin = Column(Boolean, default=False)

    @property
    def next_level_points(self):
        from utils import get_next_level_points
        return get_next_level_points(self.lifetime_points)
