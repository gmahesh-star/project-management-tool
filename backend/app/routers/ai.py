from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from groq import Groq
from .. import models, schemas, auth
from ..database import get_db
from ..config import settings

router = APIRouter(prefix="/api/ai", tags=["AI Features"])


def generate_user_stories_with_groq(project_description: str) -> List[str]:
    """Generate user stories using GROQ API"""
    if not settings.GROQ_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="GROQ API key not configured"
        )
    
    try:
        client = Groq(api_key=settings.GROQ_API_KEY)
        
        prompt = f"""You are a product manager expert. Generate detailed user stories from the following project description.

Project Description:
{project_description}

Generate user stories in the format: "As a [role], I want to [action], so that [benefit]."

Provide 5-10 comprehensive user stories that cover the main features and requirements.
Return ONLY the user stories, one per line, without numbering or additional text."""

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a product manager who writes clear, actionable user stories."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",  
            temperature=0.7,
            max_tokens=1024
        )
        
        response_text = chat_completion.choices[0].message.content
        
        # Parse user stories from response
        user_stories = []
        for line in response_text.strip().split('\n'):
            line = line.strip()
            # Remove numbering if present
            if line and (line.startswith('As a') or line.startswith('- As a') or any(c.isdigit() for c in line[:3])):
                # Clean up the line
                cleaned_line = line.lstrip('0123456789.-) ')
                if cleaned_line.startswith('As a'):
                    user_stories.append(cleaned_line)
        
        return user_stories if user_stories else [response_text]
    
    except Exception as e:
        import traceback
        print(f"GROQ API Error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating user stories: {str(e)}"
        )


@router.post("/generate-user-stories", response_model=List[str])
def generate_user_stories(
    request: schemas.UserStoryGenerate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role([models.UserRole.ADMIN, models.UserRole.MANAGER]))
):
    """Generate user stories from project description using AI (Admin and Manager only)"""
    user_stories = generate_user_stories_with_groq(request.projectDescription)
    return user_stories


@router.post("/generate-and-save/{project_id}", response_model=List[schemas.UserStoryResponse])
def generate_and_save_user_stories(
    project_id: int,
    request: schemas.UserStoryGenerate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role([models.UserRole.ADMIN, models.UserRole.MANAGER]))
):
    """Generate user stories and save them to a project"""
    try:
        # Check if project exists
        project = db.query(models.Project).filter(models.Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Generate user stories
        print(f"Generating stories for project {project_id}")
        user_stories = generate_user_stories_with_groq(request.projectDescription)
        print(f"Generated {len(user_stories)} stories")
        
        # Save to database
        db_stories = []
        for story in user_stories:
            print(f"Saving story: {story[:50]}...")
            db_story = models.UserStory(
                story=story,
                project_id=project_id,
                creator_id=current_user.id
            )
            db.add(db_story)
            db_stories.append(db_story)
        
        db.commit()
        for story in db_stories:
            db.refresh(story)
        
        print(f"Successfully saved {len(db_stories)} stories")
        return db_stories
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Error in generate_and_save: {str(e)}")
        print(traceback.format_exc())
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving user stories: {str(e)}"
        )


@router.get("/user-stories/{project_id}", response_model=List[schemas.UserStoryResponse])
def get_project_user_stories(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get all user stories for a project"""
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
    
    return project.user_stories
