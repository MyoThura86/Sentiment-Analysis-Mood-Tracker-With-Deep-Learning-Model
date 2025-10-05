import json
import hashlib
import secrets
import uuid
from datetime import datetime
import os

class UserManager:
    def __init__(self, db_path=None):
        if db_path is None:
            # Get the directory where this script is located
            current_dir = os.path.dirname(os.path.abspath(__file__))
            db_path = os.path.join(current_dir, "users_database.json")
        self.db_path = db_path

    def load_users(self):
        """Load users from JSON file"""
        try:
            if os.path.exists(self.db_path):
                with open(self.db_path, 'r') as f:
                    return json.load(f)
            return {}
        except Exception as e:
            print(f"Error loading users: {e}")
            return {}

    def save_users(self, users):
        """Save users to JSON file"""
        try:
            with open(self.db_path, 'w') as f:
                json.dump(users, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving users: {e}")
            return False

    def hash_password(self, password):
        """Hash password with salt"""
        salt = secrets.token_hex(32)
        pwd_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return f"{pwd_hash}:{salt}"

    def verify_password(self, password, stored_hash):
        """Verify password against stored hash"""
        try:
            pwd_hash, salt = stored_hash.split(':')
            return pwd_hash == hashlib.sha256((password + salt).encode()).hexdigest()
        except:
            return False

    def create_user(self, email, password, first_name, last_name):
        """Create a new user"""
        users = self.load_users()

        # Check if user already exists
        if email in users:
            return {"success": False, "error": "User already exists"}

        # Create new user
        user_id = uuid.uuid4().hex
        user_data = {
            "id": user_id,
            "email": email,
            "firstName": first_name,
            "lastName": last_name,
            "password_hash": self.hash_password(password),
            "created_at": datetime.now().isoformat(),
            "last_login": datetime.now().isoformat(),
            "profile": {
                "avatar": f"https://ui-avatars.com/api/?name={first_name}+{last_name}&background=667eea&color=fff&size=128&rounded=true",
                "bio": "",
                "preferences": {}
            }
        }

        users[email] = user_data

        if self.save_users(users):
            # Remove password hash from return data
            user_data_safe = user_data.copy()
            del user_data_safe['password_hash']
            return {"success": True, "user": user_data_safe}
        else:
            return {"success": False, "error": "Failed to save user"}

    def authenticate_user(self, email, password):
        """Authenticate user with email and password"""
        users = self.load_users()

        if email not in users:
            return {"success": False, "error": "User not found"}

        user = users[email]

        if self.verify_password(password, user['password_hash']):
            # Update last login
            user['last_login'] = datetime.now().isoformat()
            users[email] = user
            self.save_users(users)

            # Remove password hash from return data
            user_data_safe = user.copy()
            del user_data_safe['password_hash']
            return {"success": True, "user": user_data_safe}
        else:
            return {"success": False, "error": "Invalid password"}

    def get_user_by_email(self, email):
        """Get user by email"""
        users = self.load_users()

        if email not in users:
            return {"success": False, "error": "User not found"}

        user = users[email].copy()
        del user['password_hash']  # Remove password hash
        return {"success": True, "user": user}

    def get_user_by_id(self, user_id):
        """Get user by ID"""
        users = self.load_users()

        for email, user in users.items():
            if user['id'] == user_id:
                user_data = user.copy()
                del user_data['password_hash']  # Remove password hash
                return {"success": True, "user": user_data}

        return {"success": False, "error": "User not found"}

    def update_user_profile(self, email, profile_data):
        """Update user profile"""
        users = self.load_users()

        if email not in users:
            return {"success": False, "error": "User not found"}

        user = users[email]

        # Update allowed fields
        if 'firstName' in profile_data:
            user['firstName'] = profile_data['firstName']
        if 'lastName' in profile_data:
            user['lastName'] = profile_data['lastName']
        if 'profile' in profile_data:
            user['profile'].update(profile_data['profile'])

        users[email] = user

        if self.save_users(users):
            user_data_safe = user.copy()
            del user_data_safe['password_hash']
            return {"success": True, "user": user_data_safe}
        else:
            return {"success": False, "error": "Failed to update user"}