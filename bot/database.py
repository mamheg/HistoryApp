import sqlite3
import os
from typing import Optional, List, Dict, Any
from bot.config import DATABASE_URL, DB_PATH


def get_db_connection():
    """
    Get a connection to the database.
    Supports both SQLite (local) and PostgreSQL (Render).
    """
    if DATABASE_URL and DATABASE_URL.startswith("postgresql"):
        # Use PostgreSQL on Render
        import psycopg2
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    else:
        # Use SQLite locally
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn


def dict_from_row(row) -> Optional[Dict[str, Any]]:
    """Convert database row to dictionary (works for both sqlite3 and psycopg2)."""
    if row is None:
        return None

    if hasattr(row, 'keys'):  # sqlite3.Row
        return dict(row)
    else:  # psycopg2 tuple
        # For PostgreSQL, you'll need to fetch with column names
        # This is a simplified version - adjust based on your query structure
        return row


def get_user(user_id: int) -> Optional[Dict[str, Any]]:
    """Get user by Telegram ID."""
    conn = get_db_connection()
    cursor = conn.cursor()

    if DATABASE_URL and DATABASE_URL.startswith("postgresql"):
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        row = cursor.fetchone()
        if row:
            # Get column names from cursor.description
            columns = [desc[0] for desc in cursor.description]
            user = dict(zip(columns, row))
        else:
            user = None
    else:
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        user = dict(row) if row else None

    conn.close()
    return user


def create_user_if_not_exists(user_id: int, name: str, avatar_url: str = None) -> Dict[str, Any]:
    """Create user if doesn't exist (for /start command)."""
    conn = get_db_connection()
    cursor = conn.cursor()

    if DATABASE_URL and DATABASE_URL.startswith("postgresql"):
        # Check if user exists (PostgreSQL)
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        row = cursor.fetchone()

        if row:
            columns = [desc[0] for desc in cursor.description]
            user = dict(zip(columns, row))
            conn.close()
            return user

        # Create new user (PostgreSQL)
        is_admin = user_id in [1962824399, 937710441]
        cursor.execute("""
            INSERT INTO users (id, name, avatar_url, points, lifetime_points, level_name, is_admin)
            VALUES (%s, %s, %s, 340, 420, 'Бариста-Шеф', %s)
            RETURNING *
        """, (user_id, name, avatar_url, is_admin))

        row = cursor.fetchone()
        columns = [desc[0] for desc in cursor.description]
        user = dict(zip(columns, row))

    else:
        # SQLite
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()

        if row:
            user = dict(row)
            conn.close()
            return user

        # Create new user with default values
        is_admin = user_id in [1962824399, 937710441]
        cursor.execute("""
            INSERT INTO users (id, name, avatar_url, points, lifetime_points, level_name, is_admin)
            VALUES (?, ?, ?, 340, 420, 'Бариста-Шеф', ?)
        """, (user_id, name, avatar_url, is_admin))

        conn.commit()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        user = dict(row)

    conn.commit()
    conn.close()
    return user


def get_order(order_id: str) -> Optional[Dict[str, Any]]:
    """Get order by ID."""
    conn = get_db_connection()
    cursor = conn.cursor()

    if DATABASE_URL and DATABASE_URL.startswith("postgresql"):
        cursor.execute("SELECT * FROM orders WHERE id = %s", (order_id,))
        row = cursor.fetchone()
        if row:
            columns = [desc[0] for desc in cursor.description]
            order = dict(zip(columns, row))
        else:
            order = None
    else:
        cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
        row = cursor.fetchone()
        order = dict(row) if row else None

    conn.close()
    return order


def get_user_orders(user_id: int, limit: int = 10) -> List[Dict[str, Any]]:
    """Get recent orders for user."""
    conn = get_db_connection()
    cursor = conn.cursor()

    if DATABASE_URL and DATABASE_URL.startswith("postgresql"):
        cursor.execute("""
            SELECT * FROM orders
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT %s
        """, (user_id, limit))
        rows = cursor.fetchall()

        if rows:
            columns = [desc[0] for desc in cursor.description]
            orders = [dict(zip(columns, row)) for row in rows]
        else:
            orders = []
    else:
        cursor.execute("""
            SELECT * FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
        """, (user_id, limit))
        rows = cursor.fetchall()
        orders = [dict(row) for row in rows]

    conn.close()
    return orders


def get_pending_orders() -> List[Dict[str, Any]]:
    """Get all recent orders that might need notification."""
    conn = get_db_connection()
    cursor = conn.cursor()

    if DATABASE_URL and DATABASE_URL.startswith("postgresql"):
        cursor.execute("""
            SELECT o.*, u.name as user_name, u.id as user_id
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT %s
        """, (50,))
        rows = cursor.fetchall()

        if rows:
            columns = [desc[0] for desc in cursor.description]
            orders = [dict(zip(columns, row)) for row in rows]
        else:
            orders = []
    else:
        cursor.execute("""
            SELECT o.*, u.name as user_name, u.id as user_id
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT 50
        """)
        rows = cursor.fetchall()
        orders = [dict(row) for row in rows]

    conn.close()
    return orders
