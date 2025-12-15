from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    master_password_hash = Column(String(255), nullable=False)
    biometric_enabled = Column(Integer, default=0)  # 0 = False, 1 = True
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    passwords = relationship("Password", back_populates="user", cascade="all, delete-orphan")
    categories = relationship("Category", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    color = Column(String(20), nullable=False)  # hex color
    icon = Column(String(50), nullable=True)
    is_default = Column(Integer, default=0)  # 0 = custom, 1 = default
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="categories")
    passwords = relationship("Password", back_populates="category")

class Password(Base):
    __tablename__ = "passwords"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    title = Column(String(200), nullable=False)
    username = Column(String(200), nullable=True)
    email = Column(String(200), nullable=True)
    encrypted_password = Column(Text, nullable=False)  # AES-256 encrypted
    website = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="passwords")
    category = relationship("Category", back_populates="passwords")
    activity_logs = relationship("ActivityLog", back_populates="password", cascade="all, delete-orphan")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    password_id = Column(Integer, ForeignKey("passwords.id"), nullable=True)
    action = Column(String(50), nullable=False)  # created, updated, deleted, copied, viewed
    description = Column(String(500), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="activity_logs")
    password = relationship("Password", back_populates="activity_logs")
