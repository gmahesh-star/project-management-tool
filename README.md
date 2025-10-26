# Project Management Tool

A comprehensive full-stack project management system with AI-powered user story generation, built with FastAPI (Python) backend and React frontend.

## 👤 Developer Information

**Full Name:** G Mahesh
**Contact:** g.mahesh7735@gmail.com/ 7735004236
**Submission Date:** 27/10/2025

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Assumptions & Future Improvements](#assumptions--future-improvements)

---

## 📸 Screenshots

> **Note:** Screenshots are located in the `screenshots/` folder. View them locally or see the live demo.

### Dashboard
![Dashboard](screenshots/dashboard.png)
*Real-time project statistics, task breakdown, and progress tracking*

### Projects View
![Projects](screenshots/projects.png)
*Manage all projects with team assignments and status*

### Project Details with AI User Stories
![Project Details](screenshots/project-detail.png)
*View project statistics and AI-generated user stories*

### Task Management
![Tasks](screenshots/tasks.png)
*Filter and manage tasks across all projects*

### Task Details with Comments
![Task Details](screenshots/task-detail.png)
*Track task progress and collaborate with comments*

### My Tasks
![My Tasks](screenshots/my-tasks.png)
*Personal task view with status filters*

### User Management
![Users](screenshots/users.png)
*Manage team members and roles*

---

## ✨ Features

### Core Features
- ✅ **User Management** with role-based access control (Admin, Manager, Developer)
- ✅ **Project Management** - Create, edit, delete projects with team assignments
- ✅ **Task Management** - Full CRUD operations with status tracking
- ✅ **Task Status Workflow** - To Do → In Progress → Done
- ✅ **Deadline Management** with overdue task tracking
- ✅ **Team Collaboration** - Assign tasks, add comments
- ✅ **Dashboard & Analytics** - Real-time metrics and progress tracking
- ✅ **JWT Authentication** - Secure token-based authentication

### Bonus Features
- 🤖 **AI-Powered User Story Generator** using GROQ API (Llama 3.3 70B)
- 📊 **Advanced Reporting** - Project statistics, completion percentages
- 💬 **Task Comments** - Collaborative discussion on tasks
- 🎨 **Beautiful Vintage UI** - Custom TailwindCSS theme
- 🔍 **Advanced Filtering** - Filter tasks by project, status, assignee

### Role-Based Permissions

| Feature | Admin | Manager | Developer |
|---------|-------|---------|-----------|
| Manage Users | ✅ | ❌ | ❌ |
| Create/Edit Projects | ✅ | ✅ | ❌ |
| Create/Edit Tasks | ✅ | ✅ | ❌ |
| Update Own Task Status | ✅ | ✅ | ✅ |
| View Projects | ✅ | ✅ | Assigned Only |
| Add Comments | ✅ | ✅ | ✅ |
| Generate AI Stories | ✅ | ✅ | ❌ |

---

## 🛠 Tech Stack

### Backend
- **Python 3.10+**
- **FastAPI** - Modern web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Primary database
- **Alembic** - Database migrations
- **Pydantic** - Data validation
- **JWT** - Authentication
- **GROQ API** - AI user story generation
- **Pytest** - Testing framework

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **TailwindCSS** - Styling with custom vintage theme
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **date-fns** - Date formatting

---

## 📁 Project Structure

```
bespoke_assignment/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   ├── users.py         # User management
│   │   │   ├── projects.py      # Project CRUD
│   │   │   ├── tasks.py         # Task management
│   │   │   ├── ai.py            # AI user story generation
│   │   │   └── dashboard.py     # Analytics & stats
│   │   ├── models.py            # Database models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── auth.py              # Auth utilities
│   │   ├── database.py          # Database connection
│   │   ├── config.py            # Configuration
│   │   └── main.py              # FastAPI app
│   ├── tests/
│   │   └── test_auth.py         # Unit tests
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx       # Main layout
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── TaskDetail.jsx
│   │   │   ├── MyTasks.jsx
│   │   │   └── Users.jsx
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
├── docs/
│   └── ER_Diagram.md
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher
- PostgreSQL 14 or higher
- GROQ API Key (for AI features)

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/project_management
SECRET_KEY=your-secret-key-here-generate-a-strong-one
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GROQ_API_KEY=your-groq-api-key-here
```

5. **Create PostgreSQL database**
```sql
CREATE DATABASE project_management;
```

6. **Run the application**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

4. **Run the development server**
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Initial Setup

1. **Register first user** (will be created with selected role)
   - Navigate to `http://localhost:3000/register`
   - Create an Admin account first

2. **Login and start using the application**

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "role": "Developer",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/x-www-form-urlencoded

username=username&password=password123
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Project Endpoints

#### Create Project
```http
POST /api/projects/
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Project Name",
  "description": "Project description",
  "status": "Active",
  "team_member_ids": [1, 2, 3]
}
```

#### Get All Projects
```http
GET /api/projects/
Authorization: Bearer {token}
```

#### Get Project by ID
```http
GET /api/projects/{project_id}
Authorization: Bearer {token}
```

#### Update Project
```http
PUT /api/projects/{project_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "Completed"
}
```

#### Delete Project
```http
DELETE /api/projects/{project_id}
Authorization: Bearer {token}
```

### Task Endpoints

#### Create Task
```http
POST /api/tasks/
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task description",
  "status": "To Do",
  "priority": "High",
  "deadline": "2024-12-31T23:59:59",
  "project_id": 1,
  "assignee_id": 2
}
```

#### Get All Tasks (with filters)
```http
GET /api/tasks/?project_id=1&status=To%20Do&assignee_id=2
Authorization: Bearer {token}
```

#### Get My Tasks
```http
GET /api/tasks/my-tasks
Authorization: Bearer {token}
```

#### Update Task
```http
PUT /api/tasks/{task_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "In Progress"
}
```

#### Add Comment to Task
```http
POST /api/tasks/{task_id}/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "This is a comment"
}
```

### AI Endpoints

#### Generate User Stories
```http
POST /api/ai/generate-user-stories
Authorization: Bearer {token}
Content-Type: application/json

{
  "projectDescription": "An ecommerce website where customers can browse products..."
}
```

#### Generate and Save User Stories
```http
POST /api/ai/generate-and-save/{project_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "projectDescription": "Project description here..."
}
```

### Dashboard Endpoints

#### Get Dashboard Stats
```http
GET /api/dashboard/stats
Authorization: Bearer {token}
```

#### Get Project Statistics
```http
GET /api/dashboard/project-stats
Authorization: Bearer {token}
```

For complete API documentation with interactive testing, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐
│     Users       │
├─────────────────┤
│ id (PK)         │
│ email           │
│ username        │
│ full_name       │
│ hashed_password │
│ role            │
│ created_at      │
│ updated_at      │
└─────────────────┘
        │
        │ 1:N (creator)
        ▼
┌─────────────────┐         ┌──────────────────┐
│    Projects     │◄────────│ project_members  │
├─────────────────┤  N:M    │ (Association)    │
│ id (PK)         │         ├──────────────────┤
│ name            │         │ project_id (FK)  │
│ description     │         │ user_id (FK)     │
│ status          │         └──────────────────┘
│ creator_id (FK) │
│ created_at      │
│ updated_at      │
└─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐
│     Tasks       │
├─────────────────┤
│ id (PK)         │
│ title           │
│ description     │
│ status          │
│ priority        │
│ deadline        │
│ project_id (FK) │
│ assignee_id(FK) │
│ creator_id (FK) │
│ created_at      │
│ updated_at      │
└─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐
│    Comments     │
├─────────────────┤
│ id (PK)         │
│ content         │
│ task_id (FK)    │
│ author_id (FK)  │
│ created_at      │
│ updated_at      │
└─────────────────┘

┌─────────────────┐
│  User Stories   │
├─────────────────┤
│ id (PK)         │
│ story           │
│ project_id (FK) │
│ creator_id (FK) │
│ created_at      │
└─────────────────┘
```

### Database Models

**Users**
- Stores user information with role-based access
- Roles: Admin, Manager, Developer
- Password hashed using bcrypt

**Projects**
- Contains project information
- Many-to-many relationship with users (team members)
- Tracks creator and timestamps

**Tasks**
- Belongs to a project
- Can be assigned to a user
- Status: To Do, In Progress, Done
- Priority: Low, Medium, High
- Optional deadline

**Comments**
- Belongs to a task
- Created by a user
- Supports collaborative discussion

**User Stories**
- AI-generated stories linked to projects
- Stores the generated user story text

---

## 🧪 Testing

### Backend Tests

Run unit tests:
```bash
cd backend
pytest
```

Run with coverage:
```bash
pytest --cov=app tests/
```

### Test Cases Included
- User registration
- User login
- Token authentication
- Protected route access

### Manual Testing with Postman

1. Import the API endpoints into Postman
2. Test authentication flow
3. Test CRUD operations for projects and tasks
4. Test role-based permissions

---

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. **Prepare for deployment**
```bash
# Add Procfile for Heroku
echo "web: uvicorn app.main:app --host 0.0.0.0 --port \$PORT" > Procfile
```

2. **Set environment variables** on your hosting platform:
   - `DATABASE_URL`
   - `SECRET_KEY`
   - `GROQ_API_KEY`

3. **Deploy using Git**
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)

1. **Build the frontend**
```bash
cd frontend
npm run build
```

2. **Deploy to Vercel**
```bash
npm install -g vercel
vercel --prod
```

3. **Configure environment variables** on Vercel:
   - `VITE_API_URL` = Your backend URL

### Deployment Checklist
- ✅ Set all environment variables
- ✅ Configure CORS in backend for frontend domain
- ✅ Use production database
- ✅ Enable HTTPS
- ✅ Set strong SECRET_KEY
- ✅ Configure proper logging

---

## 📝 Assumptions & Future Improvements

### Assumptions Made

1. **Authentication**: All users must register before using the system
2. **Roles**: Roles are assigned during registration (in production, Admin should assign roles)
3. **Projects**: Developers can only view projects they're assigned to
4. **Tasks**: Only assigned users can update task status
5. **AI Features**: GROQ API key must be configured for AI features to work
6. **Database**: PostgreSQL is used; SQLite can be used for development

### Future Improvements

#### High Priority
- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] File attachments for tasks
- [ ] Task dependencies and subtasks
- [ ] Notifications system (email/in-app)
- [ ] Activity logs and audit trail
- [ ] Advanced search and filtering

#### Medium Priority
- [ ] Kanban board view
- [ ] Gantt chart for project timeline
- [ ] Time tracking for tasks
- [ ] Sprint management
- [ ] Custom fields for tasks
- [ ] Export reports (PDF/Excel)
- [ ] Dark mode toggle

#### Low Priority
- [ ] Mobile app (React Native)
- [ ] Real-time updates (WebSockets)
- [ ] Integration with Git repositories
- [ ] Calendar view
- [ ] Task templates
- [ ] Bulk operations
- [ ] Advanced analytics with ML

### Known Limitations

1. **Scalability**: Current implementation suitable for small to medium teams
2. **Real-time**: No WebSocket support for live updates
3. **File Storage**: No file upload functionality yet
4. **Email**: No email notifications configured
5. **Rate Limiting**: Not implemented (should add for production)

---

## 🔒 Security Considerations

- ✅ Passwords hashed with bcrypt
- ✅ JWT token-based authentication
- ✅ Role-based access control
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ CORS configured
- ⚠️ Add rate limiting for production
- ⚠️ Add input sanitization
- ⚠️ Add HTTPS enforcement

---



## 📄 License

This project was created as part of an internship assignment.

---

## 🙏 Acknowledgments

- FastAPI documentation
- React documentation
- TailwindCSS for the styling framework
- GROQ for AI capabilities
- Lucide for beautiful icons

---

**Built with ❤️ for the Bespoke Internship Assignment**
