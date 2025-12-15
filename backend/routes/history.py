from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, ActivityLog
from schemas import ActivityLogResponse

router = APIRouter(prefix="/history", tags=["Activity History"])

def get_current_user(db: Session = Depends(get_db)) -> User:
    """Get current user"""
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("", response_model=List[ActivityLogResponse])
def get_activity_history(
    limit: int = 50,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Get activity history timeline"""
    activities = db.query(ActivityLog).filter(
        ActivityLog.user_id == user.id
    ).order_by(ActivityLog.timestamp.desc()).limit(limit).all()
    
    return activities
