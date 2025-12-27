from sqlalchemy.orm import Session
import models, schemas
import utils

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    # Check if admin
    is_admin = user.id in [1962824399, 937710441] 
    
    # Default points for new user (mocked start)
    points = 340
    lifetime_points = 420
    
    level_name, _ = utils.calculate_user_level(lifetime_points)

    db_user = models.User(
        id=user.id,
        name=user.name,
        avatar_url=user.avatar_url,
        is_admin=is_admin,
        points=points,
        lifetime_points=lifetime_points,
        level_name=level_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_profile(db: Session, user_id: int, name: str, avatar_url: str):
    db_user = get_user(db, user_id)
    if db_user:
        db_user.name = name
        db_user.avatar_url = avatar_url
        
        # Ensure level is correct (self-healing)
        level_name, _ = utils.calculate_user_level(db_user.lifetime_points)
        db_user.level_name = level_name
        
        db.commit()
        db.refresh(db_user)
    return db_user
