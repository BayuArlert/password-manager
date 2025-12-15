from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Category
from schemas import UserSetup, UserLogin, AuthResponse
from security import SecurityManager

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/setup", response_model=AuthResponse)
def setup_master_password(user_data: UserSetup, db: Session = Depends(get_db)):
    """Setup master password untuk first-time user"""
    
    # Check if user already exists
    existing_user = db.query(User).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Master password already set")
    
    # Hash master password
    hashed_password = SecurityManager.hash_master_password(user_data.master_password)
    
    # Create user
    new_user = User(
        master_password_hash=hashed_password,
        biometric_enabled=1 if user_data.biometric_enabled else 0
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create default categories
    default_categories = [
        {"name": "Personal", "color": "#D5B3E0", "icon": "person", "is_default": 1},
        {"name": "Work", "color": "#B4C7E7", "icon": "briefcase", "is_default": 1},
        {"name": "Social", "color": "#F4C2C2", "icon": "users", "is_default": 1},
        {"name": "Banking", "color": "#FBBF24", "icon": "bank", "is_default": 1},
    ]
    
    for cat_data in default_categories:
        category = Category(
            user_id=new_user.id,
            name=cat_data["name"],
            color=cat_data["color"],
            icon=cat_data["icon"],
            is_default=cat_data["is_default"]
        )
        db.add(category)
    
    db.commit()
    
    # Generate session token
    token = SecurityManager.generate_session_token(new_user.id)
    
    return AuthResponse(
        user_id=new_user.id,
        token=token,
        message="Master password setup successful"
    )

@router.post("/login", response_model=AuthResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login dengan master password"""
    
    # Get user
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found. Please setup first.")
    
    # Verify password
    if not SecurityManager.verify_master_password(login_data.master_password, user.master_password_hash):
        raise HTTPException(status_code=401, detail="Invalid master password")
    
    # Generate token
    token = SecurityManager.generate_session_token(user.id)
    
    return AuthResponse(
        user_id=user.id,
        token=token,
        message="Login successful"
    )

@router.get("/check")
def check_setup(db: Session = Depends(get_db)):
    """Check apakah user sudah setup master password"""
    user = db.query(User).first()
    return {
        "setup_complete": user is not None,
        "biometric_enabled": user.biometric_enabled if user else False
    }

@router.post("/verify-biometric")
def verify_biometric(db: Session = Depends(get_db)):
    """Verify biometric authentication (client-side handled, server just generates token)"""
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.biometric_enabled:
        raise HTTPException(status_code=400, detail="Biometric not enabled")
    
    token = SecurityManager.generate_session_token(user.id)
    
    return AuthResponse(
        user_id=user.id,
        token=token,
        message="Biometric authentication successful"
    )
