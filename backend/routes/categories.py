from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, Category
from schemas import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])

def get_current_user(db: Session = Depends(get_db)) -> User:
    """Get current user"""
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("", response_model=List[CategoryResponse])
def get_categories(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Get all categories"""
    categories = db.query(Category).filter(Category.user_id == user.id).order_by(Category.is_default.desc(), Category.name).all()
    return categories

@router.post("", response_model=CategoryResponse)
def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Create custom category"""
    new_category = Category(
        user_id=user.id,
        name=category_data.name,
        color=category_data.color,
        icon=category_data.icon,
        is_default=0
    )
    
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    
    return new_category

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Update category"""
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == user.id
    ).first()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Don't allow editing default category names
    if category.is_default and category_data.name:
        raise HTTPException(status_code=400, detail="Cannot rename default categories")
    
    if category_data.name is not None:
        category.name = category_data.name
    if category_data.color is not None:
        category.color = category_data.color
    if category_data.icon is not None:
        category.icon = category_data.icon
    
    db.commit()
    db.refresh(category)
    
    return category

@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Delete custom category"""
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == user.id
    ).first()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    if category.is_default:
        raise HTTPException(status_code=400, detail="Cannot delete default categories")
    
    db.delete(category)
    db.commit()
    
    return {"message": f"Category '{category.name}' deleted successfully"}
