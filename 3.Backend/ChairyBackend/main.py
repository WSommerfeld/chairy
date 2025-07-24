from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import Base, engine, SessionLocal
from models import User
from models import Item

from schemas import ItemCreate, ItemUpdate, ItemOut

from auth import (
    get_db,
    get_password_hash,
    create_access_token,
    authenticate_user,
    get_current_user,
    UserIn,
    Token,
)

print("main.py is running")

#Create tables if don't exist
Base.metadata.create_all(bind=engine)



from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

#Allow all origins for CORS (should be restricted after hosting)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



#test endpoint
@app.get("/ping")
def ping():
    return {"msg": "pong"}

#Register endpoint
@app.post("/register")
def register(user_in: UserIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already used")

    password = get_password_hash(user_in.password)
    new_user = User(email=user_in.email, password=password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "User registered successfully"}


#Log in endpoint - returns token
@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


#Endpoint protected with token
@app.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return {"email": current_user.email}




#Get a list of all items
@app.get("/items", response_model=list[ItemOut])
def read_items(db: Session = Depends(get_db)):
    items = db.query(Item).all()
    return items

#Get a single item by id
@app.get("/items/{item_id}", response_model=ItemOut)
def read_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


#Create a new item
@app.post("/items", response_model=ItemOut)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


#Update an existing item by id
@app.put("/items/{item_id}", response_model=ItemOut)
def update_item(item_id: int, updated_item: ItemUpdate, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    for key, value in updated_item.dict().items():
        setattr(item, key, value)

    from datetime import datetime
    item.date_updated = datetime.utcnow()

    db.commit()
    db.refresh(item)
    return item


#Delete item by id
@app.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"detail": "Item deleted"}