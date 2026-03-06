from fastapi import FastAPI, APIRouter, HTTPException, Depends, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import jwt
from passlib.context import CryptContext
import shutil

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'car_marketplace')]

SECRET_KEY = os.environ.get('JWT_SECRET', 'secret-key')
ALGORITHM = "HS256"
security = HTTPBearer()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

api_router = APIRouter(prefix="/api")

class Car(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    brand: str
    model: str
    year: int
    price_sale: Optional[float] = None
    price_rent: Optional[float] = None
    for_sale: bool = True
    for_rent: bool = True
    image_url: str
    description: Optional[str] = ""
    mileage: Optional[int] = 0
    fuel_type: Optional[str] = "Gasoline"
    transmission: Optional[str] = "Automatic"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CarCreate(BaseModel):
    title: str
    brand: str
    model: str
    year: int
    price_sale: Optional[float] = None
    price_rent: Optional[float] = None
    for_sale: bool = True
    for_rent: bool = True
    image_url: str
    description: Optional[str] = ""
    mileage: Optional[int] = 0
    fuel_type: Optional[str] = "Gasoline"
    transmission: Optional[str] = "Automatic"

class CarUpdate(BaseModel):
    title: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    price_sale: Optional[float] = None
    price_rent: Optional[float] = None
    for_sale: Optional[bool] = None
    for_rent: Optional[bool] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    mileage: Optional[int] = None
    fuel_type: Optional[str] = None
    transmission: Optional[str] = None

class AdminLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ContactInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    phone: str = "+1 (555) 123-4567"
    telegram: str = "@premium_auto"

class ContactUpdate(BaseModel):
    phone: Optional[str] = None
    telegram: Optional[str] = None

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@api_router.get("/")
async def root():
    return {"message": "Car Marketplace API"}

@api_router.get("/cars", response_model=List[Car])
async def get_cars(for_sale: Optional[bool] = None, for_rent: Optional[bool] = None):
    query = {}
    if for_sale is not None:
        query["for_sale"] = for_sale
    if for_rent is not None:
        query["for_rent"] = for_rent
    cars = await db.cars.find(query, {"_id": 0}).to_list(1000)
    return cars

@api_router.get("/cars/{car_id}", response_model=Car)
async def get_car(car_id: str):
    car = await db.cars.find_one({"id": car_id}, {"_id": 0})
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

@api_router.post("/cars", response_model=Car)
async def create_car(car: CarCreate, token: dict = Depends(verify_token)):
    car_dict = car.model_dump()
    car_dict["id"] = str(uuid.uuid4())
    car_dict["created_at"] = datetime.now(timezone.utc)
    await db.cars.insert_one(car_dict)
    return car_dict

@api_router.put("/cars/{car_id}", response_model=Car)
async def update_car(car_id: str, car: CarUpdate, token: dict = Depends(verify_token)):
    update_data = {k: v for k, v in car.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    await db.cars.update_one({"id": car_id}, {"$set": update_data})
    updated_car = await db.cars.find_one({"id": car_id}, {"_id": 0})
    if not updated_car:
        raise HTTPException(status_code=404, detail="Car not found")
    return updated_car

@api_router.delete("/cars/{car_id}")
async def delete_car(car_id: str, token: dict = Depends(verify_token)):
    result = await db.cars.delete_one({"id": car_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"message": "Car deleted"}

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(data: AdminLogin):
    admin = await db.admins.find_one({"username": data.username})
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not pwd_context.verify(data.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"username": data.username}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token}

@api_router.get("/auth/check")
async def check_auth(token: dict = Depends(verify_token)):
    return {"authenticated": True, "username": token.get("username")}

@api_router.get("/contacts", response_model=ContactInfo)
async def get_contacts():
    contact = await db.contacts.find_one({}, {"_id": 0})
    if not contact:
        default = ContactInfo()
        await db.contacts.insert_one(default.model_dump())
        return default
    return contact

@api_router.put("/contacts", response_model=ContactInfo)
async def update_contacts(data: ContactUpdate, token: dict = Depends(verify_token)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if update_data:
        await db.contacts.update_one({}, {"$set": update_data}, upsert=True)
    contact = await db.contacts.find_one({}, {"_id": 0})
    return contact

@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...), token: dict = Depends(verify_token)):
    """Upload image file"""
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    file_ext = file.filename.split('.')[-1]
    new_filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = UPLOAD_DIR / new_filename
    
    # Save file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return URL
    backend_url = os.environ.get('BACKEND_URL', 'http://localhost:8001')
    file_url = f"{backend_url}/uploads/{new_filename}"
    
    return {"url": file_url}

@api_router.post("/seed")
async def seed(token: dict = Depends(verify_token)):
    """Seed initial data"""
    existing = await db.cars.find_one()
    if existing:
        return {"message": "Already seeded"}
    
    cars = [
        {
            "id": str(uuid.uuid4()),
            "title": "Mercedes-Benz S-Class",
            "brand": "Mercedes-Benz",
            "model": "S-Class",
            "year": 2024,
            "price_sale": 150000,
            "price_rent": 500,
            "for_sale": True,
            "for_rent": True,
            "image_url": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800",
            "description": "Роскошный седан с непревзойденным комфортом",
            "mileage": 10000,
            "fuel_type": "Gasoline",
            "transmission": "Automatic",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "BMW X7",
            "brand": "BMW",
            "model": "X7",
            "year": 2024,
            "price_sale": 180000,
            "price_rent": 600,
            "for_sale": True,
            "for_rent": True,
            "image_url": "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800",
            "description": "Премиальный внедорожник для всей семьи",
            "mileage": 5000,
            "fuel_type": "Diesel",
            "transmission": "Automatic",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Porsche 911",
            "brand": "Porsche",
            "model": "911",
            "year": 2023,
            "price_sale": 220000,
            "price_rent": 800,
            "for_sale": True,
            "for_rent": True,
            "image_url": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800",
            "description": "Легендарный спортивный автомобиль",
            "mileage": 8000,
            "fuel_type": "Gasoline",
            "transmission": "PDK",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Range Rover Sport",
            "brand": "Land Rover",
            "model": "Range Rover Sport",
            "year": 2024,
            "price_sale": 165000,
            "price_rent": 550,
            "for_sale": True,
            "for_rent": True,
            "image_url": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=800",
            "description": "Элегантный и мощный внедорожник",
            "mileage": 12000,
            "fuel_type": "Hybrid",
            "transmission": "Automatic",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.cars.insert_many(cars)
    return {"message": "Seeded successfully"}

@app.on_event("startup")
async def startup_event():
    """Create default admin on startup"""
    admin = await db.admins.find_one({"username": "Autorent"})
    if not admin:
        hashed = pwd_context.hash("Rentauto")
        await db.admins.insert_one({"username": "Autorent", "password": hashed})
        print("✅ Default admin created: Autorent / Rentauto")

app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
