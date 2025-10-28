# api/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, String, Integer, Boolean, Numeric, ForeignKey, desc, func, text
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os, uuid, urllib.parse
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# --- Database Setup ---
def get_database_url():
    url = os.getenv("DATABASE_URL")
    if url:
        return url
    user = os.getenv("SUPABASE_DB_USER")
    password = os.getenv("SUPABASE_DB_PASS")
    host = os.getenv("SUPABASE_DB_HOST")
    port = os.getenv("SUPABASE_DB_PORT", "5432")
    db = os.getenv("SUPABASE_DB_NAME", "postgres")
    if not (user and password and host):
        raise RuntimeError("Set DATABASE_URL or SUPABASE_DB_USER/SUPABASE_DB_PASS/SUPABASE_DB_HOST in .env")
    pwd_enc = urllib.parse.quote_plus(password)
    return f"postgresql://{user}:{pwd_enc}@{host}:{port}/{db}"

DATABASE_URL = get_database_url()
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# --- ORM Models ---
class MenuItem(Base):
    __tablename__ = "menu_items"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    price_cents = Column(Integer, nullable=False)
    category = Column(String)
    is_active = Column(Boolean, default=True)
    image_url = Column(String, nullable=True) # <-- ADD THIS LINE
    # in_stock = Column(Boolean, default=True)
    # ingredients = Column(String, nullable=True)
    # calories = Column(Integer, nullable=True)
    # spice_level = Column(Integer, default=0)

class Ingredient(Base):
    __tablename__ = "ingredients"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    unit = Column(String, nullable=False)
    stock = Column(Numeric, nullable=False, default=0)
    reorder_level = Column(Numeric, nullable=False, default=0)

class Recipe(Base):
    __tablename__ = "recipes"
    menu_item_id = Column(String, ForeignKey("menu_items.id", ondelete="CASCADE"), primary_key=True)
    ingredient_id = Column(String, ForeignKey("ingredients.id", ondelete="CASCADE"), primary_key=True)
    qty_per_dish = Column(Numeric, nullable=False)

class Order(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True)
    total_cents = Column(Integer, nullable=False)
    created_at = Column(String, server_default=text("now()"))

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(String, primary_key=True)
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"))
    menu_item_id = Column(String, ForeignKey("menu_items.id"))
    qty = Column(Integer, nullable=False)
    line_total_cents = Column(Integer, nullable=False)

class InventoryTxn(Base):
    __tablename__ = "inventory_txn"
    id = Column(String, primary_key=True)
    ingredient_id = Column(String, ForeignKey("ingredients.id"))
    delta = Column(Numeric, nullable=False)
    reason = Column(String, nullable=False)
    created_at = Column(String, server_default=text("now()"))

app = FastAPI(title="Food Inventory API")

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Request Models ---
class CartItem(BaseModel):
    menu_item_id: str
    qty: int

class OrderRequest(BaseModel):
    items: List[CartItem]

# --- API Endpoints ---
@app.get("/menu")
def get_menu():
    db = SessionLocal()
    try:
        rows = db.query(MenuItem).filter(MenuItem.is_active == True).all()
        # Add image_url to the returned data
        return [{"id": str(r.id), "name": r.name, "price_cents": r.price_cents, "category": r.category, "image_url": r.image_url} for r in rows]
    finally:
        db.close()


@app.post("/order")
def create_order(payload: OrderRequest):
    db = SessionLocal()
    try:
        menu_rows = db.query(MenuItem).filter(MenuItem.is_active == True).all()
        menu_by_id = {str(m.id): m for m in menu_rows}

        if not payload.items:
            raise HTTPException(status_code=400, detail="Cart is empty")

        total_cents = 0
        consume = {} 

        for item in payload.items:
            mi = menu_by_id.get(item.menu_item_id)
            if not mi:
                raise HTTPException(status_code=400, detail=f"Invalid menu item ID '{item.menu_item_id}'.")
            
            total_cents += mi.price_cents * item.qty
            rrows = db.query(Recipe).filter(Recipe.menu_item_id == mi.id).all()
            for r in rrows:
                consume_key = str(r.ingredient_id)
                consume[consume_key] = consume.get(consume_key, 0) + float(r.qty_per_dish) * item.qty

        if consume:
            ing_rows = db.query(Ingredient).filter(Ingredient.id.in_(list(consume.keys()))).all()
            ing_map = {str(i.id): i for i in ing_rows}
            for ing_id, need in consume.items():
                if ing_id not in ing_map:
                    raise HTTPException(status_code=500, detail="Recipe references a missing ingredient")
                ingredient = ing_map[ing_id]
                if float(ingredient.stock) < need:
                    raise HTTPException(status_code=409, detail=f"Insufficient stock for '{ingredient.name}'")

        oid = str(uuid.uuid4())
        new_order = Order(id=oid, total_cents=total_cents)
        db.add(new_order)
        
        for item in payload.items:
            mi = menu_by_id.get(item.menu_item_id)
            new_order_item = OrderItem(
                id=str(uuid.uuid4()),
                order_id=oid,
                menu_item_id=mi.id,
                qty=item.qty,
                line_total_cents=mi.price_cents * item.qty
            )
            db.add(new_order_item)

        for ing_id, need in consume.items():
            db.query(Ingredient).filter(Ingredient.id == ing_id).update({"stock": Ingredient.stock - need})
            new_txn = InventoryTxn(
                id=str(uuid.uuid4()),
                ingredient_id=ing_id,
                delta=-need,
                reason=f"order:{oid}"
            )
            db.add(new_txn)
        
        db.commit()
        return {"order_id": oid, "total_cents": total_cents}
    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(exc))
    finally:
        db.close()

# --- Stats Endpoints ---
@app.get("/stats/summary")
def get_stats_summary():
    db = SessionLocal()
    try:
        total_sales_cents = db.query(func.sum(Order.total_cents)).scalar() or 0
        total_orders = db.query(func.count(Order.id)).scalar() or 0
        return {
            "total_sales": total_sales_cents / 100,
            "total_orders": total_orders
        }
    finally:
        db.close()
        
@app.get("/stats/most-ordered-items")
def get_most_ordered_items():
    db = SessionLocal()
    try:
        results = db.query(
            MenuItem.name,
            func.sum(OrderItem.qty).label('total_sold')
        ).join(OrderItem, OrderItem.menu_item_id == MenuItem.id)\
         .group_by(MenuItem.name)\
         .order_by(desc('total_sold'))\
         .limit(5)\
         .all()
        return [{"item_name": name, "total_sold": sold} for name, sold in results]
    finally:
        db.close()

@app.get("/stats/peak-hours")
def get_peak_hours():
    db = SessionLocal()
    try:
        results = db.query(
            func.extract('hour', Order.created_at).label('hour'),
            func.count(Order.id).label('order_count')
        ).group_by('hour').order_by(desc('order_count')).all()
        return [{"hour_of_day": int(h), "order_count": c} for h, c in results]
    finally:
        db.close()

@app.get("/stats/low-stock-alert")
def get_low_stock_alert():
    db = SessionLocal()
    try:
        query = text("SELECT name, stock, reorder_level, unit FROM ingredients WHERE stock < reorder_level")
        results = db.execute(query).fetchall()
        return [
            {"name": r[0], "stock": float(r[1]), "reorder_level": float(r[2]), "unit": r[3]}
            for r in results
        ]
    finally:
        db.close()