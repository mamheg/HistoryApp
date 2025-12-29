"""
Seed script to populate the database with menu data from mockData.ts
Run this once after setting up the database.

Usage: python seed_menu.py
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
import models
import crud
import schemas

# Create tables
models.Base.metadata.create_all(bind=engine)

# Menu data (extracted from mockData.ts)
CATEGORIES = [
    {"id": "coffee", "name": "Кофе и напитки", "sort_order": 0},
    {"id": "breakfast", "name": "Завтраки", "sort_order": 1},
    {"id": "main", "name": "Основные блюда", "sort_order": 2},
    {"id": "dessert", "name": "Десерты", "sort_order": 3},
]

PRODUCTS = [
    # COFFEE & DRINKS
    {
        "name": "Латте с соленой карамелью",
        "description": "Бежевый латте с миндальными хлопьями и завитком карамели. Идеальный баланс сладкого и соленого.",
        "price": 300,
        "category_id": "coffee",
        "image_url": "https://i.postimg.cc/gnTkgZdD/image.jpg",
        "sort_order": 0,
        "modifiers": [
            {"modifier_type": "size", "name": "M (300мл)", "price": 0},
            {"modifier_type": "size", "name": "L (400мл)", "price": 60},
            {"modifier_type": "milk", "name": "Обычное", "price": 0},
            {"modifier_type": "milk", "name": "Альтернативное", "price": 50},
        ]
    },
    {
        "name": "Малиновый латте",
        "description": "Нежный розовый латте с посыпкой из сублимированной малины. Ягодная нежность в каждом глотке.",
        "price": 300,
        "category_id": "coffee",
        "image_url": "https://i.postimg.cc/pm3rLn10/image.jpg",
        "sort_order": 1,
        "modifiers": [
            {"modifier_type": "size", "name": "300мл", "price": 0},
            {"modifier_type": "milk", "name": "Обычное", "price": 0},
            {"modifier_type": "milk", "name": "Кокосовое", "price": 50},
        ]
    },
    {
        "name": "Горячий шоколад",
        "description": "Чашка густого горячего шоколада с бархатистой пенкой. Согревает и поднимает настроение.",
        "price": 250,
        "category_id": "coffee",
        "image_url": "https://i.postimg.cc/F1hRzvDv/image.jpg",
        "sort_order": 2,
        "modifiers": [
            {"modifier_type": "size", "name": "200мл", "price": 0},
            {"modifier_type": "syrup", "name": "Маршмеллоу", "price": 30},
        ]
    },
    {
        "name": "Матча латте",
        "description": "Зеленый матча латте с красивым латте-артом на пенке. Подается в широкой чашке на блюдце.",
        "price": 300,
        "category_id": "coffee",
        "image_url": "https://i.postimg.cc/TpRWzmzf/image.jpg",
        "sort_order": 3,
        "modifiers": [
            {"modifier_type": "size", "name": "300мл", "price": 0},
            {"modifier_type": "milk", "name": "Обычное", "price": 0},
            {"modifier_type": "milk", "name": "Овсяное", "price": 50},
        ]
    },
    # BREAKFAST
    {
        "name": "Авокадо-тост с лососем",
        "description": "Хрустящий тост с кремом из авокадо, ломтиками лосося, яйцом пашот и микрозеленью.",
        "price": 450,
        "category_id": "breakfast",
        "image_url": "https://i.postimg.cc/wttN5fYF/image.jpg",
        "sort_order": 0,
        "modifiers": []
    },
    {
        "name": "Круассан с овощами",
        "description": "Свежий круассан, щедро наполненный огурцом, помидором, листьями салата и нежным сыром.",
        "price": 250,
        "category_id": "breakfast",
        "image_url": "https://i.postimg.cc/nsZ8B5mb/image.jpg",
        "sort_order": 1,
        "modifiers": []
    },
    {
        "name": "Фруктовая каша",
        "description": "Питательная овсянка с клубникой, черникой, бананом, йогуртом, орехами и ломтиками сливы.",
        "price": 250,
        "category_id": "breakfast",
        "image_url": "https://i.postimg.cc/4HRpxzM4/image.jpg",
        "sort_order": 2,
        "modifiers": []
    },
    # MAIN DISHES
    {
        "name": "Говядина с овощами",
        "description": "Сочные кусочки жареной говядины с картофелем, помидорами черри, болгарским перцем и спаржей в фирменном соусе.",
        "price": 500,
        "category_id": "main",
        "image_url": "https://i.postimg.cc/KRRm8dPt/image.jpg",
        "sort_order": 0,
        "modifiers": []
    },
    {
        "name": "Креветки в карри с рисом",
        "description": "Рассыпчатый рис с ароматным соусом карри и кусочками креветок, украшенный свежей зеленью.",
        "price": 450,
        "category_id": "main",
        "image_url": "https://i.postimg.cc/qgZdSjPd/image.jpg",
        "sort_order": 1,
        "modifiers": []
    },
    {
        "name": "Креветки в остром соусе",
        "description": "Тигровые креветки в пикантном оранжевом соусе с зеленым луком и лавровым листом.",
        "price": 500,
        "category_id": "main",
        "image_url": "https://i.postimg.cc/Q9GFQjbM/image.jpg",
        "sort_order": 2,
        "modifiers": []
    },
    {
        "name": "Курица гриль с соусом",
        "description": "Аппетитная нарезанная курица на гриле, подается с насыщенным красным соусом и легким салатом.",
        "price": 400,
        "category_id": "main",
        "image_url": "https://i.postimg.cc/vx4CGwJb/image.jpg",
        "sort_order": 3,
        "modifiers": []
    },
    {
        "name": "Салат Цезарь",
        "description": "Хрустящие листья романо с куриным филе, домашними сухариками, пармезаном и помидорами черри.",
        "price": 400,
        "category_id": "main",
        "image_url": "https://i.postimg.cc/jDHmxXFQ/image.jpg",
        "sort_order": 4,
        "modifiers": []
    },
    {
        "name": "Салат с курицей",
        "description": "Легкий салат с кусочками курицы в кунжуте, свежими помидорами, зеленью, огурцом и белым сыром.",
        "price": 400,
        "category_id": "main",
        "image_url": "https://i.postimg.cc/JycLFm8R/image.jpg",
        "sort_order": 5,
        "modifiers": []
    },
    {
        "name": "Салат с киноа и курицей",
        "description": "Куриное филе в сливочном соусе с киноа, огурцом, помидором и миксом салатных листьев.",
        "price": 450,
        "category_id": "main",
        "image_url": "https://i.postimg.cc/mzBbP33S/image.jpg",
        "sort_order": 6,
        "modifiers": []
    },
    # DESSERTS
    {
        "name": "Шоколадный чизкейк",
        "description": "Роскошный кусок чизкейка с карамельным слоем, нежной кремовой серединой и шоколадным верхом.",
        "price": 350,
        "category_id": "dessert",
        "image_url": "https://i.postimg.cc/vgbQ8ThF/image.jpg",
        "sort_order": 0,
        "modifiers": []
    },
    {
        "name": "Фруктовый тарт",
        "description": "Прямоугольный тарт с заварным кремом и шапкой из свежих ягод: клубники, малины и черники.",
        "price": 300,
        "category_id": "dessert",
        "image_url": "https://i.postimg.cc/KKcLKGJd/image.jpg",
        "sort_order": 1,
        "modifiers": []
    },
    {
        "name": "Малиновый медовик",
        "description": "Авторский слоеный торт с тонкими медовыми коржами, сливочным кремом и ярким верхом из малины.",
        "price": 350,
        "category_id": "dessert",
        "image_url": "https://i.postimg.cc/c6vzgZzy/image.jpg",
        "sort_order": 2,
        "modifiers": []
    },
    {
        "name": "Торт с арахисовым маслом",
        "description": "Торт в глянцевой шоколадной глазури с насыщенным кремом из арахисового масла, украшен золотом.",
        "price": 350,
        "category_id": "dessert",
        "image_url": "https://i.postimg.cc/JsxxYdFp/image.jpg",
        "sort_order": 3,
        "modifiers": []
    },
    {
        "name": "Карамельный эклер",
        "description": "Воздушный эклер, покрытый карамельной глазурью, с дроблеными орехами и декоративными хлопьями.",
        "price": 250,
        "category_id": "dessert",
        "image_url": "https://i.postimg.cc/SXZZRt7N/image.jpg",
        "sort_order": 4,
        "modifiers": []
    },
    {
        "name": "Лимонный пирог с меренгой",
        "description": "Маленький тарт с яркой лимонной начинкой и поджаренными пиками воздушной меренги.",
        "price": 300,
        "category_id": "dessert",
        "image_url": "https://i.postimg.cc/QHrq83GR/image.jpg",
        "sort_order": 5,
        "modifiers": []
    },
    {
        "name": "Шоколадно-арахисовое печенье",
        "description": "Большое домашнее печенье с шоколадными чипсами, арахисовой посыпкой и шоколадной глазурью.",
        "price": 200,
        "category_id": "dessert",
        "image_url": "https://i.postimg.cc/hfS7ZPqP/image.jpg",
        "sort_order": 6,
        "modifiers": []
    },
]

def seed_database():
    db = SessionLocal()
    
    try:
        # Check if already seeded
        existing_categories = crud.get_categories(db)
        if existing_categories:
            print("Database already seeded. Skipping...")
            return
        
        print("Seeding categories...")
        for cat_data in CATEGORIES:
            cat = schemas.CategoryCreate(**cat_data)
            crud.create_category(db, cat)
            print(f"  + {cat_data['name']}")
        
        print("\nSeeding products...")
        for prod_data in PRODUCTS:
            modifiers = prod_data.pop("modifiers", [])
            modifier_schemas = [schemas.ModifierCreate(**m) for m in modifiers]
            product = schemas.ProductCreate(**prod_data, modifiers=modifier_schemas)
            crud.create_product(db, product)
            print(f"  + {prod_data['name']} ({len(modifiers)} modifiers)")
        
        print("\n✅ Database seeded successfully!")
        
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
