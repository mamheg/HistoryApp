from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load .env file explicitly
load_dotenv()

# Get DATABASE_URL
SQLALCHEMY_DATABASE_URL = os.getenv('DATABASE_URL')

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError('DATABASE_URL environment variable is not set. Please ensure .env file exists and contains DATABASE_URL.')

# Handle Postgres URL format for SQLAlchemy (postgres:// -> postgresql://)
if SQLALCHEMY_DATABASE_URL.startswith('postgres://'):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace('postgres://', 'postgresql://', 1)

# SQLite fallback REMOVED. Strict Postgres mode.
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
