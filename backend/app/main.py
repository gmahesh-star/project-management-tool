from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, users, projects, tasks, ai, dashboard

# Note: Database tables should be created using Alembic migrations
# Not automatically on startup in serverless environments
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Project Management Tool API",
    description="A comprehensive project management system with AI-powered user story generation",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(ai.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Project Management Tool API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
