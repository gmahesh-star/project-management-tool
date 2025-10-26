from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timezone
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get dashboard statistics"""
    # Total projects
    if current_user.role in [models.UserRole.ADMIN, models.UserRole.MANAGER]:
        total_projects = db.query(func.count(models.Project.id)).scalar()
        total_tasks = db.query(func.count(models.Task.id)).scalar()
    else:
        # Developers see only their projects
        total_projects = db.query(func.count(models.Project.id)).join(
            models.project_members
        ).filter(models.project_members.c.user_id == current_user.id).scalar()
        
        total_tasks = db.query(func.count(models.Task.id)).join(
            models.Project
        ).join(models.project_members).filter(
            models.project_members.c.user_id == current_user.id
        ).scalar()
    
    # Tasks by status
    tasks_by_status = {}
    for status in models.TaskStatus:
        count = db.query(func.count(models.Task.id)).filter(
            models.Task.status == status
        ).scalar()
        tasks_by_status[status.value] = count
    
    # Overdue tasks
    now = datetime.now(timezone.utc)
    overdue_tasks = db.query(func.count(models.Task.id)).filter(
        models.Task.deadline < now,
        models.Task.status != models.TaskStatus.DONE
    ).scalar()
    
    # My tasks
    my_tasks = db.query(func.count(models.Task.id)).filter(
        models.Task.assignee_id == current_user.id
    ).scalar()
    
    return {
        "total_projects": total_projects,
        "total_tasks": total_tasks,
        "tasks_by_status": tasks_by_status,
        "overdue_tasks": overdue_tasks,
        "my_tasks": my_tasks
    }


@router.get("/project-stats", response_model=List[schemas.ProjectStats])
def get_project_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get statistics for all projects"""
    if current_user.role in [models.UserRole.ADMIN, models.UserRole.MANAGER]:
        projects = db.query(models.Project).all()
    else:
        projects = db.query(models.Project).join(
            models.project_members
        ).filter(models.project_members.c.user_id == current_user.id).all()
    
    project_stats = []
    now = datetime.now(timezone.utc)
    
    for project in projects:
        total_tasks = len(project.tasks)
        completed_tasks = sum(1 for task in project.tasks if task.status == models.TaskStatus.DONE)
        in_progress_tasks = sum(1 for task in project.tasks if task.status == models.TaskStatus.IN_PROGRESS)
        todo_tasks = sum(1 for task in project.tasks if task.status == models.TaskStatus.TODO)
        overdue_tasks = sum(
            1 for task in project.tasks 
            if task.deadline and task.deadline < now and task.status != models.TaskStatus.DONE
        )
        
        completion_percentage = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        project_stats.append({
            "project_id": project.id,
            "project_name": project.name,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "in_progress_tasks": in_progress_tasks,
            "todo_tasks": todo_tasks,
            "overdue_tasks": overdue_tasks,
            "completion_percentage": round(completion_percentage, 2)
        })
    
    return project_stats


@router.get("/project-stats/{project_id}", response_model=schemas.ProjectStats)
def get_single_project_stats(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get statistics for a specific project"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check permissions
    if current_user.role == models.UserRole.DEVELOPER:
        if current_user not in project.team_members:
            from fastapi import HTTPException, status
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not a member of this project"
            )
    
    now = datetime.now(timezone.utc)
    total_tasks = len(project.tasks)
    completed_tasks = sum(1 for task in project.tasks if task.status == models.TaskStatus.DONE)
    in_progress_tasks = sum(1 for task in project.tasks if task.status == models.TaskStatus.IN_PROGRESS)
    todo_tasks = sum(1 for task in project.tasks if task.status == models.TaskStatus.TODO)
    overdue_tasks = sum(
        1 for task in project.tasks 
        if task.deadline and task.deadline < now and task.status != models.TaskStatus.DONE
    )
    
    completion_percentage = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    
    return {
        "project_id": project.id,
        "project_name": project.name,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "in_progress_tasks": in_progress_tasks,
        "todo_tasks": todo_tasks,
        "overdue_tasks": overdue_tasks,
        "completion_percentage": round(completion_percentage, 2)
    }
