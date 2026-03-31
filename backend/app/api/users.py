"""
User Profile API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas import UserResponse, UserUpdate, SuccessResponse
from ..services.user_service import user_service
from ..services.resume_service import resume_service
from .auth import get_current_user

router = APIRouter()


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: UserResponse = Depends(get_current_user)):
    """
    Get user profile
    
    - Returns current user's complete profile
    """
    return current_user


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user profile
    
    - Updates profile information
    - Returns updated profile
    """
    updated_user = user_service.update_user_profile(
        db, current_user.id, update_data
    )
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update profile"
        )
    
    return UserResponse.from_orm(updated_user)


@router.post("/resume/upload", response_model=SuccessResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload resume
    
    - Accepts PDF or DOCX files
    - Encrypts file at rest
    - Maximum size: 10MB
    """
    # Read file content
    try:
        file_content = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to read file"
        )
    
    # Upload and encrypt resume
    success, message, file_path = await resume_service.upload_resume(
        db, current_user.id, file_content, file.filename
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return SuccessResponse(
        message=message,
        data={
            "filename": file.filename,
            "file_path": file_path,
            "size": len(file_content)
        }
    )


@router.get("/resume/list")
async def list_resumes(
    current_user: UserResponse = Depends(get_current_user)
):
    """
    List all resumes for current user
    
    - Returns list of uploaded resumes with metadata
    """
    resumes = await resume_service.list_user_resumes(current_user.id)
    
    return {
        "resumes": resumes,
        "count": len(resumes)
    }


@router.get("/resume/download/{filename}")
async def download_resume(
    filename: str,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Download resume
    
    - Decrypts and returns resume file
    - Requires OTP verification for high-risk action (to be implemented)
    """
    from pathlib import Path
    from ..config import settings
    
    # Construct file path
    user_dir = Path(settings.UPLOAD_DIR) / f"user_{current_user.id}"
    file_path = user_dir / filename
    
    # Download and decrypt
    success, message, content = await resume_service.download_resume(
        db, current_user.id, str(file_path)
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=message
        )
    
    from fastapi.responses import Response
    
    # Determine content type
    if filename.endswith('.pdf'):
        media_type = "application/pdf"
    elif filename.endswith('.docx'):
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    else:
        media_type = "application/octet-stream"
    
    return Response(
        content=content,
        media_type=media_type,
        headers={
            "Content-Disposition": f"attachment; filename={filename.replace('.encrypted', '')}"
        }
    )


@router.delete("/resume/{filename}", response_model=SuccessResponse)
async def delete_resume(
    filename: str,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete resume
    
    - Permanently deletes resume file
    - Requires OTP verification for high-risk action (to be implemented)
    """
    from pathlib import Path
    from ..config import settings
    
    # Construct file path
    user_dir = Path(settings.UPLOAD_DIR) / f"user_{current_user.id}"
    file_path = user_dir / filename
    
    # Delete resume
    success, message = await resume_service.delete_resume(
        db, current_user.id, str(file_path)
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=message
        )
    
    return SuccessResponse(
        message=message,
        data={"deleted": True}
    )


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Get user by ID
    
    - Public profiles visible to connections
    - Full profile visible to user and admins
    """
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # TODO: Implement privacy controls
    # For now, return basic info
    return UserResponse.from_orm(user)
