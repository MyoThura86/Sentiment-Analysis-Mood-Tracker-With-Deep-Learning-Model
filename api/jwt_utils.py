"""
JWT Token Utilities for Authentication
Provides secure token generation and validation
"""
import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify


def get_jwt_config():
    """Get JWT configuration from environment variables"""
    return {
        'secret_key': os.environ.get('JWT_SECRET_KEY') or os.environ.get('SECRET_KEY', 'default-dev-secret-key-change-in-production'),
        'algorithm': os.environ.get('JWT_ALGORITHM', 'HS256'),
        'expiration_hours': int(os.environ.get('JWT_EXPIRATION_HOURS', 24))
    }


def create_token(user_id, email=None):
    """
    Create a JWT token for a user

    Args:
        user_id (str): User ID to encode in token
        email (str, optional): User email to include in token

    Returns:
        str: JWT token string
    """
    config = get_jwt_config()

    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=config['expiration_hours']),
        'iat': datetime.utcnow(),
        'type': 'access'
    }

    if email:
        payload['email'] = email

    token = jwt.encode(payload, config['secret_key'], algorithm=config['algorithm'])
    return token


def verify_token(token):
    """
    Verify and decode a JWT token

    Args:
        token (str): JWT token to verify

    Returns:
        dict: Decoded token payload if valid, None if invalid
    """
    config = get_jwt_config()

    try:
        payload = jwt.decode(token, config['secret_key'], algorithms=[config['algorithm']])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def require_auth(f):
    """
    Decorator to protect routes with JWT authentication

    Usage:
        @app.route('/api/protected')
        @require_auth
        def protected_route(current_user):
            # current_user will be the decoded JWT payload
            return jsonify({"user_id": current_user['user_id']})
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        # Allow OPTIONS requests without authentication (CORS preflight)
        if request.method == 'OPTIONS':
            return '', 200

        auth_header = request.headers.get('Authorization', '')

        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 401

        if not auth_header.startswith('Bearer '):
            return jsonify({"error": "Invalid authorization header format. Use: Bearer <token>"}), 401

        try:
            token = auth_header.split(' ')[1]
        except IndexError:
            return jsonify({"error": "Invalid authorization header format"}), 401

        payload = verify_token(token)

        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401

        # Pass the decoded user info to the route function
        return f(current_user=payload, *args, **kwargs)

    return decorated


def optional_auth(f):
    """
    Decorator that allows but doesn't require authentication
    If a valid token is provided, current_user is passed, otherwise None

    Usage:
        @app.route('/api/public-or-protected')
        @optional_auth
        def route(current_user=None):
            if current_user:
                # Authenticated user
                pass
            else:
                # Anonymous user
                pass
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        current_user = None

        if auth_header and auth_header.startswith('Bearer '):
            try:
                token = auth_header.split(' ')[1]
                current_user = verify_token(token)
            except (IndexError, Exception):
                pass  # Invalid token, continue as anonymous

        return f(current_user=current_user, *args, **kwargs)

    return decorated


def extract_user_id_from_request():
    """
    Extract user ID from the Authorization header

    Returns:
        str: User ID if valid token, None otherwise
    """
    auth_header = request.headers.get('Authorization', '')

    if not auth_header or not auth_header.startswith('Bearer '):
        return None

    try:
        token = auth_header.split(' ')[1]
        payload = verify_token(token)
        return payload.get('user_id') if payload else None
    except (IndexError, Exception):
        return None
