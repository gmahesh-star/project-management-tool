from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/projects", tags=["Projects"])


@router.post("/", response_model=schemas.ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role([models.UserRole.ADMIN, models.UserRole.MANAGER]))
):
    """Create a new project (Admin and Manager only)"""
    db_project = models.Project(
        name=project.name,
        description=project.description,
        status=project.status,
        start_date=project.start_date,
        end_date=project.end_date,
        creator_id=current_user.id
    )
    
    # Add team members
    if project.team_member_ids:
        team_members = db.query(models.User).filter(models.User.id.in_(project.team_member_ids)).all()
        db_project.team_members = team_members
    
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.get("/", response_model=List[schemas.ProjectResponse])
def get_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get all projects (filtered by role)"""
    if current_user.role in [models.UserRole.ADMIN, models.UserRole.MANAGER]:
        projects = db.query(models.Project).offset(skip).limit(limit).all()
    else:
        # Developers see only projects they're assigned to
        projects = db.query(models.Project).join(
            models.project_members
        ).filter(models.project_members.c.user_id == current_user.id).offset(skip).limit(limit).all()
    
    # Add task count to each project
    for project in projects:
        project.task_count = len(project.tasks)
    
    return projects


@router.get("/{project_id}", response_model=schemas.ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get project by ID"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check permissions
    if current_user.role == models.UserRole.DEVELOPER:
        if current_user not in project.team_members:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not a member of this project"
            )
    
    project.task_count = len(project.tasks)
    return project


@router.put("/{project_id}", response_model=schemas.ProjectResponse)
def update_project(
    project_id: int,
    project_update: schemas.ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role([models.UserRole.ADMIN, models.UserRole.MANAGER]))
):
    """Update project (Admin and Manager only)"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project_update.dict(exclude_unset=True)
    
    # Handle team members separately
    if "team_member_ids" in update_data:
        team_member_ids = update_data.pop("team_member_ids")
        team_members = db.query(models.User).filter(models.User.id.in_(team_member_ids)).all()
        project.team_members = team_members
    
    for field, value in update_data.items():
        setattr(project, field, value)
    
    db.commit()
    db.refresh(project)
    project.task_count = len(project.tasks)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role([models.UserRole.ADMIN, models.UserRole.MANAGER]))
):
    """Delete project (Admin and Manager only)"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return None
