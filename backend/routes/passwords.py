from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import User, Password, ActivityLog
from schemas import PasswordCreate, PasswordUpdate, PasswordResponse, PasswordDecrypted
from security import SecurityManager

router = APIRouter(prefix="/passwords", tags=["Passwords"])

def get_current_user(db: Session = Depends(get_db)) -> User:
    """Get current user (simplified, production should use JWT)"""
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("", response_model=List[PasswordResponse])
def get_passwords(
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Get all passwords dengan optional search dan filter"""
    query = db.query(Password).filter(Password.user_id == user.id)
    
    if search:
        query = query.filter(
            (Password.title.contains(search)) |
            (Password.username.contains(search)) |
            (Password.email.contains(search)) |
            (Password.website.contains(search))
        )
    
    if category_id:
        query = query.filter(Password.category_id == category_id)
    
    passwords = query.order_by(Password.created_at.desc()).all()
    return passwords

@router.post("", response_model=PasswordResponse)
def create_password(
    password_data: PasswordCreate,
    master_password: str = Header(..., alias="X-Master-Password"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Create new password entry"""
    
    # Verify master password
    if not SecurityManager.verify_master_password(master_password, user.master_password_hash):
        raise HTTPException(status_code=401, detail="Invalid master password")
    
    # Encrypt password
    encrypted_pwd = SecurityManager.encrypt_password(password_data.password, master_password)
    
    # Create password entry
    new_password = Password(
        user_id=user.id,
        title=password_data.title,
        username=password_data.username,
        email=password_data.email,
        encrypted_password=encrypted_pwd,
        website=password_data.website,
        notes=password_data.notes,
        category_id=password_data.category_id
    )
    
    db.add(new_password)
    db.commit()
    db.refresh(new_password)
    
    # Log activity
    activity = ActivityLog(
        user_id=user.id,
        password_id=new_password.id,
        action="created",
        description=f"Created password for {password_data.title}"
    )
    db.add(activity)
    db.commit()
    
    return new_password

@router.get("/{password_id}", response_model=PasswordResponse)
def get_password(
    password_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Get single password details"""
    password = db.query(Password).filter(
        Password.id == password_id,
        Password.user_id == user.id
    ).first()
    
    if not password:
        raise HTTPException(status_code=404, detail="Password not found")
    
    return password

@router.post("/{password_id}/decrypt", response_model=PasswordDecrypted)
def decrypt_password(
    password_id: int,
    master_password: str = Header(..., alias="X-Master-Password"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Decrypt password untuk copy ke clipboard"""
    
    # Verify master password
    if not SecurityManager.verify_master_password(master_password, user.master_password_hash):
        raise HTTPException(status_code=401, detail="Invalid master password")
    
    # Get password
    password = db.query(Password).filter(
        Password.id == password_id,
        Password.user_id == user.id
    ).first()
    
    if not password:
        raise HTTPException(status_code=404, detail="Password not found")
    
    # Decrypt
    try:
        decrypted = SecurityManager.decrypt_password(password.encrypted_password, master_password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Log activity
    activity = ActivityLog(
        user_id=user.id,
        password_id=password.id,
        action="copied",
        description=f"Copied password for {password.title}"
    )
    db.add(activity)
    db.commit()
    
    return PasswordDecrypted(password=decrypted)

@router.put("/{password_id}", response_model=PasswordResponse)
def update_password(
    password_id: int,
    password_data: PasswordUpdate,
    master_password: str = Header(..., alias="X-Master-Password"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Update password entry"""
    
    # Verify master password
    if not SecurityManager.verify_master_password(master_password, user.master_password_hash):
        raise HTTPException(status_code=401, detail="Invalid master password")
    
    # Get password
    password = db.query(Password).filter(
        Password.id == password_id,
        Password.user_id == user.id
    ).first()
    
    if not password:
        raise HTTPException(status_code=404, detail="Password not found")
    
    # Update fields
    if password_data.title is not None:
        password.title = password_data.title
    if password_data.username is not None:
        password.username = password_data.username
    if password_data.email is not None:
        password.email = password_data.email
    if password_data.password is not None:
        password.encrypted_password = SecurityManager.encrypt_password(password_data.password, master_password)
    if password_data.website is not None:
        password.website = password_data.website
    if password_data.notes is not None:
        password.notes = password_data.notes
    if password_data.category_id is not None:
        password.category_id = password_data.category_id
    
    db.commit()
    db.refresh(password)
    
    # Log activity
    activity = ActivityLog(
        user_id=user.id,
        password_id=password.id,
        action="updated",
        description=f"Updated password for {password.title}"
    )
    db.add(activity)
    db.commit()
    
    return password

@router.delete("/{password_id}")
def delete_password(
    password_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Delete password entry"""
    password = db.query(Password).filter(
        Password.id == password_id,
        Password.user_id == user.id
    ).first()
    
    if not password:
        raise HTTPException(status_code=404, detail="Password not found")
    
    title = password.title
    
    # Log activity before delete
    activity = ActivityLog(
        user_id=user.id,
        password_id=None,  # Will be null after delete
        action="deleted",
        description=f"Deleted password for {title}"
    )
    db.add(activity)
    
    db.delete(password)
    db.commit()
    
    return {"message": f"Password '{title}' deleted successfully"}
