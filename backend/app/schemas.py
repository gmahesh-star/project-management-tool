from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from .models import UserRole, TaskStatus


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    role: UserRole


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None


# Project Schemas
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: Optional[str] = "Active"
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class ProjectCreate(ProjectBase):
    team_member_ids: Optional[List[int]] = []


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    team_member_ids: Optional[List[int]] = None


class ProjectResponse(ProjectBase):
    id: int
    creator_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]
    team_members: List[UserResponse] = []
    task_count: Optional[int] = 0

    class Config:
        from_attributes = True


# Task Schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.TODO
    priority: Optional[str] = "Medium"
    deadline: Optional[datetime] = None


class TaskCreate(TaskBase):
    project_id: int
    assignee_id: Optional[int] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[str] = None
    deadline: Optional[datetime] = None
    assignee_id: Optional[int] = None


class TaskResponse(TaskBase):
    id: int
    project_id: int
    assignee_id: Optional[int]
    creator_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]
    assignee: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# Comment Schemas
class CommentBase(BaseModel):
    content: str


class CommentCreate(CommentBase):
    task_id: int


class CommentResponse(CommentBase):
    id: int
    task_id: int
    author_id: int
    author: UserResponse
    created_at: datetime

    class Config:
        from_attributes = True


# User Story Schemas
class UserStoryGenerate(BaseModel):
    projectDescription: str


class UserStoryResponse(BaseModel):
    id: int
    story: str
    project_id: int
    creator_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


# Dashboard Schemas
class DashboardStats(BaseModel):
    total_projects: int
    total_tasks: int
    tasks_by_status: dict
    overdue_tasks: int
    my_tasks: int


class ProjectStats(BaseModel):
    project_id: int
    project_name: str
    total_tasks: int
    completed_tasks: int
    in_progress_tasks: int
    todo_tasks: int
    overdue_tasks: int
    completion_percentage: float
