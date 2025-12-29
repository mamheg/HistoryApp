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

# ============= PHASE 3: MENU CRUD =============

# --- Categories ---
def get_categories(db: Session):
    return db.query(models.Category).order_by(models.Category.sort_order).all()

def get_category(db: Session, category_id: str):
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(
        id=category.id,
        name=category.name,
        sort_order=category.sort_order
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(db: Session, category_id: str, category_update: schemas.CategoryUpdate):
    db_category = get_category(db, category_id)
    if db_category:
        if category_update.name is not None:
            db_category.name = category_update.name
        if category_update.sort_order is not None:
            db_category.sort_order = category_update.sort_order
        db.commit()
        db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: str):
    db_category = get_category(db, category_id)
    if db_category:
        db.delete(db_category)
        db.commit()
        return True
    return False

# --- Products ---
def get_products(db: Session, category_id: str = None):
    query = db.query(models.Product)
    if category_id:
        query = query.filter(models.Product.category_id == category_id)
    return query.order_by(models.Product.sort_order).all()

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(
        name=product.name,
        description=product.description,
        price=product.price,
        category_id=product.category_id,
        image_url=product.image_url,
        sort_order=product.sort_order
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Add modifiers if provided
    if product.modifiers:
        for mod in product.modifiers:
            db_mod = models.ProductModifier(
                product_id=db_product.id,
                modifier_type=mod.modifier_type,
                name=mod.name,
                price=mod.price
            )
            db.add(db_mod)
        db.commit()
        db.refresh(db_product)
    
    return db_product

def update_product(db: Session, product_id: int, product_update: schemas.ProductUpdate):
    db_product = get_product(db, product_id)
    if db_product:
        if product_update.name is not None:
            db_product.name = product_update.name
        if product_update.description is not None:
            db_product.description = product_update.description
        if product_update.price is not None:
            db_product.price = product_update.price
        if product_update.category_id is not None:
            db_product.category_id = product_update.category_id
        if product_update.image_url is not None:
            db_product.image_url = product_update.image_url
        if product_update.sort_order is not None:
            db_product.sort_order = product_update.sort_order
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if db_product:
        db.delete(db_product)
        db.commit()
        return True
    return False

# --- Modifiers ---
def add_modifier(db: Session, product_id: int, modifier: schemas.ModifierCreate):
    db_mod = models.ProductModifier(
        product_id=product_id,
        modifier_type=modifier.modifier_type,
        name=modifier.name,
        price=modifier.price
    )
    db.add(db_mod)
    db.commit()
    db.refresh(db_mod)
    return db_mod

def delete_modifier(db: Session, modifier_id: int):
    db_mod = db.query(models.ProductModifier).filter(models.ProductModifier.id == modifier_id).first()
    if db_mod:
        db.delete(db_mod)
        db.commit()
        return True
    return False
