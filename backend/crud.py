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

def update_user_points(db: Session, user_id: int, points: int, lifetime_points: int):
    # This might still be useful for manual updates, but orders will use create_order
    db_user = get_user(db, user_id)
    if db_user:
        db_user.points = points
        db_user.lifetime_points = lifetime_points
        level_name, _ = utils.calculate_user_level(lifetime_points)
        db_user.level_name = level_name
        db.commit()
        db.refresh(db_user)
    return db_user

import random

def create_order(db: Session, order: schemas.OrderCreate):
    # 1. Get User
    db_user = get_user(db, order.user_id)
    if not db_user:
        # Should we auto-create? For now assume sync happened.
        return None

    # 2. Calculate Earned Points (5% if no points used)
    points_earned = 0
    if order.points_used == 0:
        points_earned = int(order.total_price * 0.05)
    
    # 3. Process Transaction (Deduct + Accrue)
    # Check balance
    if db_user.points < order.points_used:
        # Not enough points, logic? just prevent overwrite or error?
        # For MVP let's assume valid, but ideally error.
        pass
    
    new_points = db_user.points - order.points_used + points_earned
    new_lifetime = db_user.lifetime_points + points_earned
    
    # Update User
    db_user.points = new_points
    db_user.lifetime_points = new_lifetime
    
    level_name, _ = utils.calculate_user_level(new_lifetime)
    db_user.level_name = level_name

    # 4. Create Order Record
    # Generate ID
    order_id = f"ORD-{random.randint(1000, 9999)}"
    
    db_order = models.Order(
        id=order_id,
        user_id=order.user_id,
        total_price=order.total_price,
        points_used=order.points_used,
        points_earned=points_earned,
        items_summary=order.items_summary,
        pickup_time=order.pickup_time,
        comment=order.comment
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    return db_order
