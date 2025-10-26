from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.post("/", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Create a new task"""
    # Check if project exists
    project = db.query(models.Project).filter(models.Project.id == task.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check permissions
    if current_user.role == models.UserRole.DEVELOPER:
        if current_user not in project.team_members:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not a member of this project"
            )
    
    db_task = models.Task(
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        deadline=task.deadline,
        project_id=task.project_id,
        assignee_id=task.assignee_id,
        creator_id=current_user.id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@router.get("/", response_model=List[schemas.TaskResponse])
def get_tasks(
    project_id: Optional[int] = None,
    status: Optional[str] = None,
    assignee_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get tasks with optional filters"""
    query = db.query(models.Task)
    
    if project_id:
        query = query.filter(models.Task.project_id == project_id)
    
    if status:
        query = query.filter(models.Task.status == status)
    
    if assignee_id:
        query = query.filter(models.Task.assignee_id == assignee_id)
    
    # Filter by user role
    if current_user.role == models.UserRole.DEVELOPER:
        # Developers see only tasks assigned to them or in their projects
        query = query.join(models.Project).join(
            models.project_members
        ).filter(
            (models.Task.assignee_id == current_user.id) | 
            (models.project_members.c.user_id == current_user.id)
        )
    
    tasks = query.offset(skip).limit(limit).all()
    return tasks


@router.get("/my-tasks", response_model=List[schemas.TaskResponse])
def get_my_tasks(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get tasks assigned to current user"""
    tasks = db.query(models.Task).filter(models.Task.assignee_id == current_user.id).all()
    return tasks


@router.get("/{task_id}", response_model=schemas.TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get task by ID"""
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check permissions
    if current_user.role == models.UserRole.DEVELOPER:
        if task.assignee_id != current_user.id and current_user not in task.project.team_members:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this task"
            )
    
    return task


@router.put("/{task_id}", response_model=schemas.TaskResponse)
def update_task(
    task_id: int,
    task_update: schemas.TaskUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Update task"""
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check permissions
    if current_user.role == models.UserRole.DEVELOPER:
        # Developers can only update status of their assigned tasks
        if task.assignee_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this task"
            )
        # Developers can only update status
        allowed_fields = {"status"}
        update_data = {k: v for k, v in task_update.dict(exclude_unset=True).items() if k in allowed_fields}
    else:
        update_data = task_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(task, field, value)
    
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role([models.UserRole.ADMIN, models.UserRole.MANAGER]))
):
    """Delete task (Admin and Manager only)"""
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(task)
    db.commit()
    return None


@router.post("/{task_id}/comments", response_model=schemas.CommentResponse, status_code=status.HTTP_201_CREATED)
def add_comment(
    task_id: int,
    comment: schemas.CommentBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Add comment to task"""
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_comment = models.Comment(
        content=comment.content,
        task_id=task_id,
        author_id=current_user.id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment


@router.get("/{task_id}/comments", response_model=List[schemas.CommentResponse])
def get_comments(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get all comments for a task"""
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return task.comments
