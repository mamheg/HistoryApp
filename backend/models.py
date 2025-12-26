from sqlalchemy import Column, Integer, String, Boolean, BigInteger
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True) # Telegram ID
    name = Column(String, index=True)
    avatar_url = Column(String, nullable=True)
    
    # Phase 2 fields (defined now to avoid migration later, but not used yet if we want strict phased)
    # But user asked for sequential adoption. Let's keep it minimal for Phase 1 as requested?
    # User said: "first just user... then bonuses".
    # However, it's easier to create the full user schema now to avoid "alter table" issues next step.
    # I will include them but we will only populate basic info in Phase 1.
    points = Column(Integer, default=340) # Mock default
    lifetime_points = Column(Integer, default=420)
    level_name = Column(String, default="Бариста-Шеф")
    
    is_admin = Column(Boolean, default=False)
