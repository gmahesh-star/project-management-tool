from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum


class UserRole(str, enum.Enum):
    ADMIN = "Admin"
    MANAGER = "Manager"
    DEVELOPER = "Developer"


class TaskStatus(str, enum.Enum):
    TODO = "To Do"
    IN_PROGRESS = "In Progress"
    DONE = "Done"


# Association table for project team members
project_members = Table(
    'project_members',
    Base.metadata,
    Column('project_id', Integer, ForeignKey('projects.id', ondelete='CASCADE')),
    Column('user_id', Integer, ForeignKey('users.id', ondelete='CASCADE'))
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.DEVELOPER)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    created_projects = relationship("Project", back_populates="creator", foreign_keys="Project.creator_id")
    assigned_tasks = relationship("Task", back_populates="assignee", foreign_keys="Task.assignee_id")
    created_tasks = relationship("Task", back_populates="creator", foreign_keys="Task.creator_id")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    projects = relationship("Project", secondary=project_members, back_populates="team_members")
    user_stories = relationship("UserStory", back_populates="creator", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    status = Column(String, default="Active")
    start_date = Column(String)
    end_date = Column(String)
    creator_id = Column(Integer, ForeignKey("users.id", ondelete='SET NULL'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    creator = relationship("User", back_populates="created_projects", foreign_keys=[creator_id])
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    team_members = relationship("User", secondary=project_members, back_populates="projects")
    user_stories = relationship("UserStory", back_populates="project", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text)
    status = Column(Enum(TaskStatus), nullable=False, default=TaskStatus.TODO)
    priority = Column(String, default="Medium")
    deadline = Column(DateTime(timezone=True))
    project_id = Column(Integer, ForeignKey("projects.id", ondelete='CASCADE'), nullable=False)
    assignee_id = Column(Integer, ForeignKey("users.id", ondelete='SET NULL'))
    creator_id = Column(Integer, ForeignKey("users.id", ondelete='SET NULL'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="assigned_tasks", foreign_keys=[assignee_id])
    creator = relationship("User", back_populates="created_tasks", foreign_keys=[creator_id])
    comments = relationship("Comment", back_populates="task", cascade="all, delete-orphan")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete='CASCADE'), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id", ondelete='CASCADE'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    task = relationship("Task", back_populates="comments")
    author = relationship("User", back_populates="comments")


class UserStory(Base):
    __tablename__ = "user_stories"

    id = Column(Integer, primary_key=True, index=True)
    story = Column(Text, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete='CASCADE'), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id", ondelete='SET NULL'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    project = relationship("Project", back_populates="user_stories")
    creator = relationship("User", back_populates="user_stories")
