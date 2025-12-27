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
