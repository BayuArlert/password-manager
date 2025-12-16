import sys
import os

# Tambahkan root directory ke sys.path agar bisa import folder 'backend'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import app FastAPI dari backend/main.py
from backend.main import app
