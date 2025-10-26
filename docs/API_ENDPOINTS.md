# API Endpoints Documentation

Complete list of all REST API endpoints for the Project Management Tool.

**Base URL**: `http://localhost:8000`

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "username": "username",
  "full_name": "John Doe",
  "role": "Developer",
  "password": "securepassword"
}
```

**Response**: `201 Created`

### POST /api/auth/login
Login and receive JWT token.

**Request**: Form data with `username` and `password`

**Response**:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### GET /api/auth/me
Get current authenticated user details.

**Headers**: `Authorization: Bearer {token}`

**Response**: User object

## Project Endpoints

### POST /api/projects/
Create new project (Admin/Manager only)

### GET /api/projects/
Get all projects

### GET /api/projects/{id}
Get project by ID

### PUT /api/projects/{id}
Update project

### DELETE /api/projects/{id}
Delete project

## Task Endpoints

### POST /api/tasks/
Create new task

### GET /api/tasks/
Get all tasks (with filters)

### GET /api/tasks/my-tasks
Get tasks assigned to current user

### GET /api/tasks/{id}
Get task by ID

### PUT /api/tasks/{id}
Update task

### DELETE /api/tasks/{id}
Delete task

### POST /api/tasks/{id}/comments
Add comment to task

### GET /api/tasks/{id}/comments
Get all comments for task

## AI Endpoints

### POST /api/ai/generate-user-stories
Generate user stories using AI

### POST /api/ai/generate-and-save/{project_id}
Generate and save user stories to project

### GET /api/ai/user-stories/{project_id}
Get all user stories for project

## Dashboard Endpoints

### GET /api/dashboard/stats
Get dashboard statistics

### GET /api/dashboard/project-stats
Get statistics for all projects

### GET /api/dashboard/project-stats/{project_id}
Get statistics for specific project

For interactive documentation, visit: `http://localhost:8000/docs`
