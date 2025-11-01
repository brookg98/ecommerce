from typing import Any
from fastapi import HTTPException, status


def raise_not_found(resource: str, resource_id: Any = None):
    msg = f"{resource} not found"
    if resource_id:
        msg += f" with id: {resource_id}"
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=msg)


def raise_unauthorized(detail: str = "Could not validate credentials"):
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def raise_forbidden(detail: str = "Forbidden"):
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


def raise_bad_request(detail: str):
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)
