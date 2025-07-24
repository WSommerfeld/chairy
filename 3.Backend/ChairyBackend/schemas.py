from pydantic import BaseModel
from typing import Optional
from datetime import datetime

#pydantic data models (for API communication)

#Base model containing shared fields for items
class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    quantity: int
    status: Optional[str] = None

#Model for creating a new item (used in POST requests)
class ItemCreate(ItemBase):
    pass

#Model for updating an existing item (used in PUT or PATCH requests)
class ItemUpdate(ItemBase):
    pass

#Model for returning item data in API responses (used in GET requests)
class ItemOut(ItemBase):
    id: int
    date_added: Optional[datetime]
    date_updated: Optional[datetime]

    class Config:
        orm_mode = True
