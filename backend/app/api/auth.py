"""
Authentication API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.schemas import (
    UserCreate, UserLogin, UserResponse, Token,
    OTPRequest, OTPVerify, OTPResponse, SuccessResponse
)
from ..services.user_service import user_service
from ..services.otp_service import otp_service
from ..security import JWTHandler
from ..config import settings

router = APIRouter()
security = HTTPBearer()


@router.post("/register", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user
    
    - Creates user account with role-specific data
    - Sends OTP to email for verification
    - Password must meet security requirements
    """
    # Check if user already exists
    existing_user = user_service.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or mobile already registered"
        )
    
    # Create user with role and company data
    user = user_service.create_user(db, user_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration failed. Please check your details."
        )
    
    # Generate and send email OTP
    success, message = await otp_service.generate_and_send_otp(
        db, user.id, "email", email=user.email
    )
    
    if not success:
        # User created but OTP failed - still return success
        return SuccessResponse(
            message="Registration successful. Please contact support for verification.",
            data={"user_id": user.id, "email": user.email}
        )
    
    return SuccessResponse(
        message="Registration successful. Please check your email for verification code.",
        data={"user_id": user.id, "email": user.email, "role": user.role.value}
    )


@router.post("/verify-email", response_model=SuccessResponse)
async def verify_email(otp_data: OTPVerify, db: Session = Depends(get_db)):
    """
    Verify email with OTP
    
    - Verifies the OTP code sent to email
    - Marks user as verified
    """
    # Get user by email
    user = user_service.get_user_by_email(db, otp_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify OTP
    success, message = otp_service.verify_otp(
        db, user.id, otp_data.otp_code, "email"
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    # Mark user as verified
    user_service.verify_user(db, user.id)
    
    # Send welcome email
    await user_service.send_welcome_email(user)
    
    return SuccessResponse(
        message="Email verified successfully",
        data={"verified": True}
    )


@router.post("/verify-mobile", response_model=SuccessResponse)
async def verify_mobile(otp_data: OTPVerify, db: Session = Depends(get_db)):
    """
    Verify mobile number with OTP
    
    - Verifies the OTP code sent to mobile
    """
    # Get user by mobile
    user = user_service.get_user_by_mobile(db, otp_data.mobile)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify OTP
    success, message = otp_service.verify_otp(
        db, user.id, otp_data.otp_code, "mobile"
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return SuccessResponse(
        message="Mobile verified successfully",
        data={"verified": True}
    )


@router.post("/resend-otp", response_model=OTPResponse)
async def resend_otp(otp_request: OTPRequest, db: Session = Depends(get_db)):
    """
    Resend OTP code
    
    - Generates new OTP and sends to email or mobile
    """
    # Get user
    user = None
    if otp_request.email:
        user = user_service.get_user_by_email(db, otp_request.email)
    elif otp_request.mobile:
        user = user_service.get_user_by_mobile(db, otp_request.mobile)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Resend OTP
    success, message = await otp_service.resend_otp(
        db, user.id, otp_request.otp_type,
        email=otp_request.email,
        mobile=otp_request.mobile
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=message
        )
    
    return OTPResponse(
        message=message,
        expires_in=settings.OTP_EXPIRE_MINUTES * 60
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    User login
    
    - Authenticates user with email and password
    - Returns JWT access token
    - User must be verified and active
    """
    # Authenticate user
    user = user_service.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Check if verified
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in"
        )
    
    # Update last login
    user_service.update_last_login(db, user.id)
    
    # Generate JWT token
    token_data = {
        "user_id": user.id,
        "email": user.email,
        "role": user.role.value
    }
    access_token = JWTHandler.create_access_token(token_data)
    
    # Create user response data
    user_data = {
        "id": user.id,
        "email": user.email,
        "role": user.role.value,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_verified": user.is_verified,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat()
    }
    
    return Token(
        token=access_token,
        user=user_data,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post("/logout", response_model=SuccessResponse)
async def logout():
    """
    User logout
    
    - In a stateless JWT system, logout is handled client-side
    - Client should delete the token
    - For added security, implement token blacklisting in production
    """
    return SuccessResponse(
        message="Logged out successfully",
        data={"logged_out": True}
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> UserResponse:
    """
    Dependency to get current authenticated user
    
    - Validates JWT token
    - Returns user information
    """
    token = credentials.credentials
    
    # Decode token
    payload = JWTHandler.decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Get user
    user_id = payload.get("user_id")
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    return UserResponse.from_orm(user)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserResponse = Depends(get_current_user)):
    """
    Get current user information
    
    - Returns authenticated user's profile
    """
    return current_user
