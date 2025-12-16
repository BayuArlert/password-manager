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
    try:
        init_db()
        print("✅ Database initialized!")
    except Exception as e:
        print(f"❌ Database init failed: {e}")
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

@app.get("/debug_env")
def debug_env():
    import os
    status = {"status": "debug"}
    
    # Cek Library
    try:
        import pg8000
        status["pg8000"] = "installed ✅"
    except ImportError as e:
        status["pg8000"] = f"MISSING ❌: {e}"

    # Cek ENV
    db_url = os.getenv("DATABASE_URL", "NOT_SET")
    if db_url == "NOT_SET":
        status["env_db"] = "MISSING ❌"
    else:
        # Tampilkan 15 karakter awal saja demi keamanan
        status["env_db"] = f"FOUND ✅: {db_url[:15]}..."
        
    return status

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
