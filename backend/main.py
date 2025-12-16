import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db
from routes import auth, passwords, categories, history

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database
    print("🚀 Initializing database...")
    init_db()
    print("✅ Database initialized!")
    yield
    # Shutdown
    print("👋 Shutting down...")

app = FastAPI(
    title="Password Manager API",
    description="Secure password manager with AES-256 encryption",
    version="1.0.0",
    lifespan=lifespan,
    root_path="/api" if os.getenv("VERCEL") else ""
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(passwords.router)
app.include_router(categories.router)
app.include_router(history.router)

@app.get("/")
def read_root():
    return {
        "message": "🔐 Password Manager API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
