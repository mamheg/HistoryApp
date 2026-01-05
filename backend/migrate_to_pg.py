
import os
import sqlite3
import psycopg2
from psycopg2.extras import execute_values
from sqlalchemy import create_engine
from database import Base
from models import User, Order, Category, Product, ProductModifier

# Config
SQLITE_DB = "backend/database.db" # Relative from project root if run from root, or just "database.db" if from backend
if not os.path.exists(SQLITE_DB) and os.path.exists("database.db"):
    SQLITE_DB = "database.db"

# Postgres Config (using "localhost" assuming script runs on server)
PG_USER = "history_user"
PG_PASSWORD = "history_password"
PG_HOST = "localhost"
PG_PORT = "5432"
PG_DB = "history_app"
PG_URL = f"postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DB}"

# Tables to migrate in order
TABLES = ["users", "categories", "products", "orders", "product_modifiers"]

def migrate():
    print(f"Starting migration from {SQLITE_DB} to {PG_DB}...")

    # 1. Ensure Schema Exists & Clean State
    print("Preparing schema in Postgres...")
    try:
        pg_engine = create_engine(PG_URL)
        # We need to create tables if they don't exist
        Base.metadata.create_all(bind=pg_engine)
        
        # Then truncate to ensure we don't have duplicates if we re-run
        pg_conn = psycopg2.connect(PG_URL)
        cur = pg_conn.cursor()
        for table in TABLES:
             # Check if table has data
             cur.execute(f"TRUNCATE TABLE {table} CASCADE;")
        pg_conn.commit()
        pg_conn.close()
        print("Schema ensured and tables truncated.")
    except Exception as e:
        print(f"Error preparing schema: {e}")
        # Continue anyway, maybe tables exist


    # 2. Connect to SQLite
    try:
        sl_conn = sqlite3.connect(SQLITE_DB)
        sl_cursor = sl_conn.cursor()
    except Exception as e:
        print(f"Error connecting to SQLite {SQLITE_DB}: {e}")
        return

    # 3. Migrate Data
    pg_conn = None
    try:
        pg_conn = psycopg2.connect(PG_URL)
        pg_cursor = pg_conn.cursor()

        for table in TABLES:
            print(f"Migrating table '{table}'...")
            
            # Check if table exists in SQLite
            try:
                sl_cursor.execute(f"SELECT * FROM {table}")
                rows = sl_cursor.fetchall()
                
                # Manual fix for Booleans in 'users' table (is_admin)
                if table == "users":
                    # Assuming is_admin is the last column or we find it by name.
                    # Let's inspect columns to find index of is_admin
                    cols = [d[0] for d in sl_cursor.description]
                    try:
                        idx = cols.index("is_admin")
                        # Convert 1 -> True, 0 -> False
                        new_rows = []
                        for r in rows:
                            r_list = list(r)
                            r_list[idx] = bool(r_list[idx])
                            new_rows.append(tuple(r_list))
                        rows = new_rows
                    except ValueError:
                        pass # is_admin not found
            except sqlite3.OperationalError:
                print(f"  Table '{table}' not found in SQLite. Skipping.")
                continue

            if not rows:
                print(f"  No data in '{table}'.")
                continue

            # Get columns
            columns = [description[0] for description in sl_cursor.description]
            cols_str = ", ".join(columns)
            # Bulk Insert
            # execute_values expects a query with "VALUES %s"
            insert_query = f"INSERT INTO {table} ({cols_str}) VALUES %s"
            
            try:
                execute_values(pg_cursor, insert_query, rows)
                pg_conn.commit()
                print(f"  ✓ Migrated {len(rows)} rows.")
            except Exception as e:
                pg_conn.rollback()
                print(f"  ✗ Error migrating '{table}': {e}")

    except Exception as e:
        print(f"Migration error: {e}")
    finally:
        if sl_conn: sl_conn.close()
        if pg_conn: 
            pg_conn.close()
            print("Postgres connection closed.")

if __name__ == "__main__":
    migrate()
