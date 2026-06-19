"""
Firebase Admin SDK — Token verification & user management.
Validates Firebase ID tokens sent from the Next.js frontend.
"""
import json
import structlog
import firebase_admin
from firebase_admin import credentials, auth
from app.config import settings

log = structlog.get_logger()

_firebase_app = None


def init_firebase() -> None:
    """Initialize Firebase Admin SDK (called once at startup)."""
    global _firebase_app
    if _firebase_app is not None:
        return

    try:
        # Support both JSON string and file path
        key = settings.FIREBASE_SERVICE_ACCOUNT_KEY
        if key.startswith("{"):
            cred_dict = json.loads(key)
            cred = credentials.Certificate(cred_dict)
        else:
            cred = credentials.Certificate(key)

        _firebase_app = firebase_admin.initialize_app(
            cred,
            {"projectId": settings.FIREBASE_PROJECT_ID},
        )
        log.info("Firebase Admin SDK initialized", project=settings.FIREBASE_PROJECT_ID)
    except Exception as e:
        log.error("Failed to initialize Firebase Admin SDK", error=str(e))
        if settings.ENVIRONMENT == "production":
            raise


def verify_firebase_token(id_token: str) -> dict:
    """
    Verify a Firebase ID token and return decoded claims.

    Args:
        id_token: Firebase ID token from the frontend

    Returns:
        Decoded token claims dict with uid, email, etc.

    Raises:
        ValueError: If token is invalid or expired
    """
    if _firebase_app is None:
        init_firebase()

    try:
        decoded_token = auth.verify_id_token(id_token, check_revoked=True)
        return decoded_token
    except auth.RevokedIdTokenError:
        raise ValueError("Token has been revoked. Please sign in again.")
    except auth.ExpiredIdTokenError:
        raise ValueError("Token has expired. Please sign in again.")
    except auth.InvalidIdTokenError as e:
        raise ValueError(f"Invalid token: {str(e)}")
    except Exception as e:
        log.error("Firebase token verification failed", error=str(e))
        raise ValueError("Authentication failed")
