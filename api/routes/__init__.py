"""
Flask Blueprints for API Routes

This package contains modular route blueprints for better code organization.
Each blueprint handles a specific domain of the application.
"""

from .auth import auth_bp
from .predictions import predictions_bp
from .journal import journal_bp
from .tests import tests_bp

__all__ = [
    'auth_bp',
    'predictions_bp',
    'journal_bp',
    'tests_bp'
]
