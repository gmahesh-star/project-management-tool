# Quick Setup Instructions

## Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

## Backend Setup (5 minutes)

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 5. Create database
# In PostgreSQL: CREATE DATABASE project_management;

# 6. Run server
uvicorn app.main:app --reload
```

Backend running at: http://localhost:8000
API Docs: http://localhost:8000/docs

## Frontend Setup (3 minutes)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env if needed (default: http://localhost:8000)

# 4. Run development server
npm run dev
```

Frontend running at: http://localhost:3000

## First Steps

1. Open http://localhost:3000
2. Click "Register" and create an Admin account
3. Login with your credentials
4. Start creating projects and tasks!

## Optional: Setup AI Features

1. Get GROQ API key from https://console.groq.com
2. Add to backend/.env: `GROQ_API_KEY=your_key_here`
3. Restart backend server
4. Use "AI Stories" button in project details

## Troubleshooting

**Database connection error?**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

**Frontend can't reach backend?**
- Check backend is running on port 8000
- Verify VITE_API_URL in frontend/.env

**Import errors?**
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again

## Need Help?

- Check README.md for detailed documentation
- View API docs at http://localhost:8000/docs
- Check logs in terminal for error messages
