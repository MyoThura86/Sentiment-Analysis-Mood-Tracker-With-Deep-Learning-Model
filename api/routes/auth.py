"""
Authentication Blueprint

Handles all authentication-related routes including:
- Email/password login and registration
- OAuth (Google, GitHub)
- User profile management
"""
from flask import Blueprint, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import logging
import secrets
import requests

# Import from parent modules
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from user_manager import UserManager
from database import MoodTrackingDB
from jwt_utils import create_token

logger = logging.getLogger(__name__)

# Create blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Initialize managers
user_manager = UserManager()
db = MoodTrackingDB()


@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def auth_login():
    """
    User login endpoint
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              example: user@example.com
            password:
              type: string
              example: password123
    responses:
      200:
        description: Login successful
        schema:
          type: object
          properties:
            success:
              type: boolean
            token:
              type: string
            user:
              type: object
      400:
        description: Invalid credentials
      401:
        description: Authentication failed
    """
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        email = data.get('email', '').strip()
        password = data.get('password', '')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Authenticate user using UserManager
        result = user_manager.authenticate_user(email, password)

        if result['success']:
            user = result['user']
            token = create_token(user['id'], user['email'])
            return jsonify({
                "success": True,
                "token": token,
                "user": {
                    "id": user['id'],
                    "email": user['email'],
                    "name": f"{user['firstName']} {user['lastName']}",
                    "firstName": user['firstName'],
                    "lastName": user['lastName'],
                    "profile": user['profile']
                }
            })
        else:
            return jsonify({"error": result['error']}), 401

    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def auth_register():
    """
    User registration endpoint
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
            password:
              type: string
            firstName:
              type: string
            lastName:
              type: string
            name:
              type: string
    responses:
      200:
        description: Registration successful
      400:
        description: Invalid input or user already exists
    """
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        email = data.get('email', '').strip()
        password = data.get('password', '')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Handle both formats: single 'name' field or separate firstName/lastName
        name = data.get('name', '').strip()
        first_name = data.get('firstName', '').strip()
        last_name = data.get('lastName', '').strip()

        # If single name is provided, split it
        if name and not first_name and not last_name:
            name_parts = name.split(' ', 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ''

        # Validate required fields
        if not email or not password or not first_name:
            return jsonify({"error": "Email, password, and name are required"}), 400

        # Create user using UserManager
        result = user_manager.create_user(email, password, first_name, last_name)

        if result['success']:
            user = result['user']
            # Also create user in mood tracking database
            db.create_user(user['id'], user['email'], f"{user['firstName']} {user['lastName']}")

            token = create_token(user['id'], user['email'])
            return jsonify({
                "success": True,
                "token": token,
                "user": {
                    "id": user['id'],
                    "email": user['email'],
                    "name": f"{user['firstName']} {user['lastName']}",
                    "firstName": user['firstName'],
                    "lastName": user['lastName'],
                    "profile": user['profile']
                }
            })
        else:
            return jsonify({"error": result['error']}), 400

    except Exception as e:
        logger.error(f"Registration error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@auth_bp.route('/google', methods=['POST', 'OPTIONS'])
def auth_google():
    """
    Google OAuth authentication endpoint
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            credential:
              type: string
    responses:
      200:
        description: OAuth successful
      400:
        description: Invalid credential
      500:
        description: OAuth not configured
    """
    if request.method == 'OPTIONS':
        return '', 200

    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests as google_requests

        data = request.get_json()
        credential = data.get('credential')

        if not credential:
            return jsonify({"success": False, "message": "No credential provided"}), 400

        # Verify the Google credential
        try:
            google_client_id = os.environ.get('GOOGLE_CLIENT_ID')
            if not google_client_id:
                return jsonify({"error": "Google OAuth not configured on server"}), 500

            idinfo = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                google_client_id
            )

            # Validate idinfo contains required fields
            if not idinfo or 'email' not in idinfo:
                return jsonify({"success": False, "message": "Invalid Google token: missing email"}), 400

            email = idinfo.get('email')
            given_name = idinfo.get('given_name', '')
            family_name = idinfo.get('family_name', '')
            name = idinfo.get('name', f"{given_name} {family_name}")

            # Additional validation
            if not email or '@' not in email:
                return jsonify({"success": False, "message": "Invalid email from Google"}), 400

        except ValueError as e:
            return jsonify({"success": False, "message": f"Invalid credential: {str(e)}"}), 400
        except Exception as e:
            logger.error(f"Google token verification error: {e}")
            return jsonify({"success": False, "message": "Failed to verify Google credential"}), 400

        # Check if user already exists
        user_result = user_manager.get_user_by_email(email)

        if user_result['success']:
            # User exists, return existing user
            user = user_result['user']
        else:
            # Create new user with OAuth data
            # Parse name into first and last
            name_parts = name.split(' ', 1)
            first_name = given_name or name_parts[0] if name_parts else 'User'
            last_name = family_name or (name_parts[1] if len(name_parts) > 1 else '')

            # Create with a random password (OAuth users don't use password login)
            random_password = secrets.token_hex(32)

            create_result = user_manager.create_user(email, random_password, first_name, last_name)

            if not create_result['success']:
                return jsonify({"error": create_result['error']}), 400

            user = create_result['user']

        token = create_token(user['id'], user['email'])
        return jsonify({
            "success": True,
            "token": token,
            "user": {
                "id": user['id'],
                "email": user['email'],
                "name": f"{user['firstName']} {user['lastName']}",
                "firstName": user['firstName'],
                "lastName": user['lastName'],
                "profile": user['profile']
            }
        })

    except Exception as e:
        logger.error(f"Google OAuth error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@auth_bp.route('/github', methods=['POST', 'OPTIONS'])
def auth_github():
    """
    GitHub OAuth authentication endpoint
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            code:
              type: string
    responses:
      200:
        description: OAuth successful
      400:
        description: Invalid code or failed to get user info
      500:
        description: OAuth not configured
    """
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json()
        code = data.get('code')

        # If code is provided, exchange it for user info
        if code:
            client_id = os.environ.get('GITHUB_CLIENT_ID')
            client_secret = os.environ.get('GITHUB_CLIENT_SECRET')

            if not client_id or not client_secret:
                return jsonify({"error": "GitHub OAuth not configured on server"}), 500

            # Exchange code for access token
            token_response = requests.post('https://github.com/login/oauth/access_token',
                headers={'Accept': 'application/json'},
                data={
                    'client_id': client_id,
                    'client_secret': client_secret,
                    'code': code
                },
                timeout=10)

            # Check for HTTP errors
            if token_response.status_code != 200:
                logger.error(f"GitHub token exchange failed with status {token_response.status_code}")
                return jsonify({"success": False, "message": "Failed to exchange GitHub code for token"}), 400

            token_data = token_response.json()

            # Check for errors in response
            if 'error' in token_data:
                logger.error(f"GitHub OAuth error: {token_data.get('error_description', token_data.get('error'))}")
                return jsonify({"success": False, "message": "GitHub authentication failed"}), 400

            access_token = token_data.get('access_token')

            if not access_token:
                return jsonify({"success": False, "message": "Failed to get access token from GitHub"}), 400

            # Get user info from GitHub
            user_response = requests.get('https://api.github.com/user',
                headers={'Authorization': f'token {access_token}'},
                timeout=10)

            # Check user API response
            if user_response.status_code != 200:
                logger.error(f"GitHub user API failed with status {user_response.status_code}")
                return jsonify({"success": False, "message": "Failed to get GitHub user info"}), 400

            github_user = user_response.json()

            # Validate response structure
            if 'id' not in github_user:
                return jsonify({"success": False, "message": "Invalid GitHub user response"}), 400

            email = github_user.get('email')

            # If email is not public, get primary email
            if not email:
                emails_response = requests.get('https://api.github.com/user/emails',
                    headers={'Authorization': f'token {access_token}'},
                    timeout=10)

                if emails_response.status_code == 200:
                    emails = emails_response.json()
                    if isinstance(emails, list):
                        for e in emails:
                            if e.get('primary'):
                                email = e.get('email')
                                break

            # Validate email
            if not email or '@' not in email:
                return jsonify({"success": False, "message": "Could not retrieve valid email from GitHub"}), 400

            name = github_user.get('name') or github_user.get('login')
            login = github_user.get('login')
        else:
            # Legacy: Direct email/name/login provided
            email = data.get('email', '').strip()
            name = data.get('name', '').strip()
            login = data.get('login', '').strip()

        if not email:
            return jsonify({"success": False, "message": "Email is required"}), 400

        # Check if user already exists
        user_result = user_manager.get_user_by_email(email)

        if user_result['success']:
            # User exists
            user = user_result['user']
        else:
            # Create new user
            name_parts = (name or login).split(' ', 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ''

            # Create with a random password (OAuth users don't use password login)
            random_password = secrets.token_hex(32)

            create_result = user_manager.create_user(email, random_password, first_name, last_name)

            if not create_result['success']:
                return jsonify({"error": create_result['error']}), 400

            user = create_result['user']

        token = create_token(user['id'], user['email'])
        return jsonify({
            "success": True,
            "token": token,
            "user": {
                "id": user['id'],
                "email": user['email'],
                "name": f"{user['firstName']} {user['lastName']}",
                "firstName": user['firstName'],
                "lastName": user['lastName'],
                "profile": user['profile']
            }
        })

    except Exception as e:
        logger.error(f"GitHub OAuth error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500
