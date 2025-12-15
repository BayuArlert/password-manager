from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# User Schemas
class UserSetup(BaseModel):
    master_password: str
    biometric_enabled: bool = False

class UserLogin(BaseModel):
    master_password: str

class UserResponse(BaseModel):
    id: int
    biometric_enabled: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Category Schemas
class CategoryCreate(BaseModel):
    name: str
    color: str
    icon: Optional[str] = None

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None

class CategoryResponse(BaseModel):
    id: int
    name: str
    color: str
    icon: Optional[str]
    is_default: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Password Schemas
class PasswordCreate(BaseModel):
    title: str
    username: Optional[str] = None
    email: Optional[str] = None
    password: str  # Will be encrypted before saving
    website: Optional[str] = None
    notes: Optional[str] = None
    category_id: Optional[int] = None

class PasswordUpdate(BaseModel):
    title: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    website: Optional[str] = None
    notes: Optional[str] = None
    category_id: Optional[int] = None

class PasswordResponse(BaseModel):
    id: int
    title: str
    username: Optional[str]
    email: Optional[str]
    website: Optional[str]
    notes: Optional[str]
    category_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    category: Optional[CategoryResponse] = None
    
    class Config:
        from_attributes = True

class PasswordDecrypted(BaseModel):
    password: str

# Activity Log Schemas
class ActivityLogCreate(BaseModel):
    password_id: Optional[int] = None
    action: str
    description: Optional[str] = None

class ActivityLogResponse(BaseModel):
    id: int
    action: str
    description: Optional[str]
    timestamp: datetime
    password_id: Optional[int]
    
    class Config:
        from_attributes = True

# Auth Response
class AuthResponse(BaseModel):
    user_id: int
    token: str
    message: str
