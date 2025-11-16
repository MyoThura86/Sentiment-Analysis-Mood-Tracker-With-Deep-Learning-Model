"""
Centralized Configuration Module
Contains all configuration constants and environment variable handling
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Config:
    """Base configuration class with common settings"""

    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.getenv('FLASK_ENV', 'development') == 'development'

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', SECRET_KEY)
    JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
    JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', 24))

    # OAuth Configuration
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
    GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')

    # Database Configuration
    DATABASE_PATH = os.getenv('DATABASE_PATH', 'api/mood_tracking.db')
    USERS_DATABASE_PATH = os.getenv('USERS_DATABASE_PATH', 'api/users_database.json')
    JOURNAL_DATABASE_PATH = os.getenv('JOURNAL_DATABASE_PATH', 'api/journal_entries.json')

    # API Configuration
    API_HOST = os.getenv('API_HOST', '0.0.0.0')
    API_PORT = int(os.getenv('API_PORT', 5001))

    # CORS Configuration
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
    ALLOWED_ORIGINS = [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
    ]

    # Add production URL if specified
    if FRONTEND_URL and FRONTEND_URL not in ALLOWED_ORIGINS:
        ALLOWED_ORIGINS.append(FRONTEND_URL)

    # Rate Limiting Configuration
    RATE_LIMIT_STORAGE = os.getenv('RATE_LIMIT_STORAGE', 'memory://')
    RATE_LIMIT_DEFAULT = os.getenv('RATE_LIMIT_DEFAULT', '1000 per day, 100 per hour')

    # Input Validation Limits
    MAX_TEXT_LENGTH = int(os.getenv('MAX_TEXT_LENGTH', 5000))
    MAX_FILE_SIZE = int(os.getenv('MAX_FILE_SIZE', 10 * 1024 * 1024))  # 10MB
    MAX_CSV_ROWS = int(os.getenv('MAX_CSV_ROWS', 1000))

    # Model Configuration
    ROBERTA_MODEL_PATH = os.getenv('ROBERTA_MODEL_PATH', '../Fine_tuned_RoBERTa/roberta_sentiment_model')
    ROBERTA_TOKENIZER_PATH = os.getenv('ROBERTA_TOKENIZER_PATH', '../Fine_tuned_RoBERTa/roberta_tokenizer')
    LSTM_MODEL_PATH = os.getenv('LSTM_MODEL_PATH', '../mentalbert_lstm_model.keras')


class DevelopmentConfig(Config):
    """Development-specific configuration"""
    DEBUG = True
    RATE_LIMIT_STORAGE = 'memory://'


class ProductionConfig(Config):
    """Production-specific configuration"""
    DEBUG = False
    # In production, use Redis for rate limiting if available
    RATE_LIMIT_STORAGE = os.getenv('REDIS_URL', 'memory://')

    # More restrictive rate limits in production
    RATE_LIMIT_DEFAULT = '500 per day, 50 per hour'


class TestingConfig(Config):
    """Testing-specific configuration"""
    TESTING = True
    DEBUG = True
    DATABASE_PATH = ':memory:'  # Use in-memory database for tests


# Configuration dictionary
config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config(config_name=None):
    """
    Get configuration object based on environment

    Args:
        config_name: Optional config name override

    Returns:
        Configuration class instance
    """
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    return config_by_name.get(config_name, DevelopmentConfig)
