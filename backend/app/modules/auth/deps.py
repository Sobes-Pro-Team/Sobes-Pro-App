from uuid import UUID

from fastapi import Depends, HTTPException, Request

from app.core.config import settings
from app.core.db.connection import database
from app.core.db.models import User
from app.modules.auth.repository import AuthRepository
from app.modules.auth.service import AuthService

DEMO_USER_ID = UUID("00000000-0000-0000-0000-0000000000d0")


def get_auth_repository() -> AuthRepository:
    return AuthRepository(database)


def get_auth_service(
    request: Request,
    repository: AuthRepository = Depends(get_auth_repository),
) -> AuthService:
    return AuthService(
        settings,
        getattr(request.app.state, "http", None),
        repository,
    )


async def get_optional_user(
    request: Request,
    service: AuthService = Depends(get_auth_service),
) -> User | None:
    token = request.cookies.get(settings.session_cookie_name)
    return await service.current_user(token)


async def get_current_user(
    user: User | None = Depends(get_optional_user),
) -> User:
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


async def get_current_user_id(
    user: User | None = Depends(get_optional_user),
) -> UUID:
    if user is not None:
        return user.id
    if settings.demo_mode:
        return DEMO_USER_ID
    raise HTTPException(status_code=401, detail="Not authenticated")
