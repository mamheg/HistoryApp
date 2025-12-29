from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, crud
from database import SessionLocal, engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hoffee Shop API")

# Allow CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/auth", response_model=schemas.User)
def auth_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user.id)
    if db_user:
        # Update info if exists
        updated_user = crud.update_user_profile(db, user.id, user.name, user.avatar_url)
        return updated_user
    else:
        return crud.create_user(db, user=user)

@app.get("/api/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

class UpdatePointsRequest(schemas.BaseModel):
    points: int
    lifetime_points: int

@app.post("/api/users/{user_id}/points", response_model=schemas.User)
def update_points(user_id: int, data: UpdatePointsRequest, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return crud.update_user_points(db, user_id, data.points, data.lifetime_points)

@app.post("/api/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    db_order = crud.create_order(db, order)
    if db_order is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_order

# ============= PHASE 3: MENU API =============

@app.get("/api/menu", response_model=schemas.MenuResponse)
def get_menu(db: Session = Depends(get_db)):
    """Public endpoint: Get full menu with categories, products, and modifiers"""
    categories = crud.get_categories(db)
    return {"categories": categories}

# --- Admin: Categories ---
def check_admin(user_id: int, db: Session):
    """Helper to verify admin status"""
    user = crud.get_user(db, user_id)
    if not user or not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@app.post("/api/admin/categories", response_model=schemas.Category)
def admin_create_category(
    category: schemas.CategoryCreate,
    admin_id: int,
    db: Session = Depends(get_db)
):
    check_admin(admin_id, db)
    existing = crud.get_category(db, category.id)
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")
    return crud.create_category(db, category)

@app.put("/api/admin/categories/{category_id}", response_model=schemas.Category)
def admin_update_category(
    category_id: str,
    category_update: schemas.CategoryUpdate,
    admin_id: int,
    db: Session = Depends(get_db)
):
    check_admin(admin_id, db)
    updated = crud.update_category(db, category_id, category_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Category not found")
    return updated

@app.delete("/api/admin/categories/{category_id}")
def admin_delete_category(
    category_id: str,
    admin_id: int,
    db: Session = Depends(get_db)
):
    check_admin(admin_id, db)
    if not crud.delete_category(db, category_id):
        raise HTTPException(status_code=404, detail="Category not found")
    return {"ok": True}

# --- Admin: Products ---
@app.post("/api/admin/products", response_model=schemas.Product)
def admin_create_product(
    product: schemas.ProductCreate,
    admin_id: int,
    db: Session = Depends(get_db)
):
    check_admin(admin_id, db)
    # Check category exists
    if not crud.get_category(db, product.category_id):
        raise HTTPException(status_code=400, detail="Category not found")
    return crud.create_product(db, product)

@app.put("/api/admin/products/{product_id}", response_model=schemas.Product)
def admin_update_product(
    product_id: int,
    product_update: schemas.ProductUpdate,
    admin_id: int,
    db: Session = Depends(get_db)
):
    check_admin(admin_id, db)
    updated = crud.update_product(db, product_id, product_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated

@app.delete("/api/admin/products/{product_id}")
def admin_delete_product(
    product_id: int,
    admin_id: int,
    db: Session = Depends(get_db)
):
    check_admin(admin_id, db)
    if not crud.delete_product(db, product_id):
        raise HTTPException(status_code=404, detail="Product not found")
    return {"ok": True}

# --- Admin: Modifiers ---
@app.post("/api/admin/products/{product_id}/modifiers", response_model=schemas.Modifier)
def admin_add_modifier(
    product_id: int,
    modifier: schemas.ModifierCreate,
    admin_id: int,
    db: Session = Depends(get_db)
):
    check_admin(admin_id, db)
    if not crud.get_product(db, product_id):
        raise HTTPException(status_code=404, detail="Product not found")
    return crud.add_modifier(db, product_id, modifier)

@app.delete("/api/admin/modifiers/{modifier_id}")
def admin_delete_modifier(
    modifier_id: int,
    admin_id: int,
    db: Session = Depends(get_db)
):
    check_admin(admin_id, db)
    if not crud.delete_modifier(db, modifier_id):
        raise HTTPException(status_code=404, detail="Modifier not found")
    return {"ok": True}

# Serve Static Files (CSS, JS, Images)
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
import os
import uvicorn

# Robust path handling
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, "../dist")
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Create static directory if not exists
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)

# Mount static files first
# Check if dist exists (frontend build)
if os.path.exists(DIST_DIR):
    # Mount assets folder
    assets_path = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")
    
    # Mount public folders for videos and images
    PUBLIC_DIR = os.path.join(BASE_DIR, "../public")
    videos_path = os.path.join(PUBLIC_DIR, "videos")
    images_path = os.path.join(PUBLIC_DIR, "images")
    
    if os.path.exists(videos_path):
        app.mount("/videos", StaticFiles(directory=videos_path), name="videos")
        print(f"Serving videos from: {videos_path}")
    
    if os.path.exists(images_path):
        app.mount("/images", StaticFiles(directory=images_path), name="images")
        print(f"Serving images from: {images_path}")
    
    # Serve index.html for root and any other path (SPA support)
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Allow API calls to pass through
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="Not found")
        
        # Determine if it's a file request or a route request
        target_file = os.path.join(DIST_DIR, full_path)
        if "." in full_path and os.path.exists(target_file):
             return FileResponse(target_file)
             
        # Otherwise serve index.html
        return FileResponse(os.path.join(DIST_DIR, "index.html"))
else:
    print(f"WARNING: '{DIST_DIR}' folder not found. Run 'npm run build' in frontend folder.")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=4000, reload=True)
