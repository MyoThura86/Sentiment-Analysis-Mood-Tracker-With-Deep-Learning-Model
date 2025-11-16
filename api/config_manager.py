"""
Environment Configuration Manager (Phase 4)

Manages configuration for different environments:
- Development
- Staging
- Production
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class BaseConfig:
    """Base configuration shared across all environments"""

    # Flask Core
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    FLASK_APP = os.getenv('FLASK_APP', 'api.app')

    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', SECRET_KEY)
    JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
    JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', '24'))

    # Database
    DATABASE_PATH = os.getenv('DATABASE_PATH', './data/moodtracker.db')
    USERS_DATABASE_PATH = os.getenv('USERS_DATABASE_PATH', './api/users_database.json')
    JOURNAL_DATABASE_PATH = os.getenv('JOURNAL_DATABASE_PATH', './data/journal.db')

    # API
    API_HOST = os.getenv('API_HOST', '0.0.0.0')
    API_PORT = int(os.getenv('API_PORT', '5001'))
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')

    # CORS
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')

    # OAuth
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', '')
    GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID', '')
    GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET', '')

    # Input Validation
    MAX_TEXT_LENGTH = int(os.getenv('MAX_TEXT_LENGTH', '5000'))
    MAX_FILE_SIZE = int(os.getenv('MAX_FILE_SIZE', '10485760'))  # 10MB
    MAX_CSV_ROWS = int(os.getenv('MAX_CSV_ROWS', '1000'))

    # ML Models
    ROBERTA_MODEL_PATH = os.getenv('ROBERTA_MODEL_PATH', '../Fine_tuned_RoBERTa/roberta_sentiment_model')
    ROBERTA_TOKENIZER_PATH = os.getenv('ROBERTA_TOKENIZER_PATH', '../Fine_tuned_RoBERTa/roberta_tokenizer')
    LSTM_MODEL_PATH = os.getenv('LSTM_MODEL_PATH', '../mentalbert_lstm_model.keras')

    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FORMAT = os.getenv('LOG_FORMAT', '%(asctime)s [%(levelname)s] %(name)s: %(message)s')
    LOG_FILE = os.getenv('LOG_FILE', './logs/api.log')

    # Redis
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    RATE_LIMIT_STORAGE = os.getenv('RATE_LIMIT_STORAGE', 'memory://')

    # Caching
    CACHE_TYPE = os.getenv('CACHE_TYPE', 'simple')
    CACHE_DEFAULT_TIMEOUT = int(os.getenv('CACHE_DEFAULT_TIMEOUT', '300'))
    CACHE_KEY_PREFIX = os.getenv('CACHE_KEY_PREFIX', 'moodtracker_')
    CACHE_REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

    # Security Headers
    ENABLE_SECURITY_HEADERS = os.getenv('ENABLE_SECURITY_HEADERS', 'True').lower() == 'true'

    # Sentry
    SENTRY_DSN = os.getenv('SENTRY_DSN', '')
    SENTRY_ENVIRONMENT = os.getenv('SENTRY_ENVIRONMENT', 'development')
    SENTRY_TRACES_SAMPLE_RATE = float(os.getenv('SENTRY_TRACES_SAMPLE_RATE', '0.1'))


class DevelopmentConfig(BaseConfig):
    """Development environment configuration"""

    DEBUG = True
    TESTING = False

    # More verbose logging in development
    LOG_LEVEL = 'DEBUG'

    # Use simple cache in development
    CACHE_TYPE = 'simple'

    # Less strict rate limiting in development
    RATE_LIMIT_STORAGE = 'memory://'

    # Disable security headers in development for easier testing
    ENABLE_SECURITY_HEADERS = False


class StagingConfig(BaseConfig):
    """Staging environment configuration"""

    DEBUG = False
    TESTING = False

    # Use Redis in staging
    CACHE_TYPE = 'redis'
    RATE_LIMIT_STORAGE = BaseConfig.REDIS_URL

    # Enable security headers
    ENABLE_SECURITY_HEADERS = True

    # Moderate logging
    LOG_LEVEL = 'INFO'


class ProductionConfig(BaseConfig):
    """Production environment configuration"""

    DEBUG = False
    TESTING = False

    # Production uses Redis for everything
    CACHE_TYPE = 'redis'
    RATE_LIMIT_STORAGE = BaseConfig.REDIS_URL

    # Strict security
    ENABLE_SECURITY_HEADERS = True

    # Less verbose logging
    LOG_LEVEL = 'WARNING'

    # More aggressive caching
    CACHE_DEFAULT_TIMEOUT = 600  # 10 minutes

    # Ensure secret keys are set
    @staticmethod
    def validate():
        """Validate production configuration"""
        errors = []

        if BaseConfig.SECRET_KEY == 'dev-secret-key-change-in-production':
            errors.append("SECRET_KEY must be changed in production")

        if BaseConfig.JWT_SECRET_KEY == BaseConfig.SECRET_KEY:
            errors.append("JWT_SECRET_KEY should be different from SECRET_KEY")

        if not BaseConfig.GOOGLE_CLIENT_ID or 'your-' in BaseConfig.GOOGLE_CLIENT_ID:
            errors.append("GOOGLE_CLIENT_ID must be set for OAuth")

        if errors:
            raise ValueError(f"Production configuration errors: {', '.join(errors)}")


class TestingConfig(BaseConfig):
    """Testing environment configuration"""

    DEBUG = True
    TESTING = True

    # Use in-memory everything for tests
    DATABASE_PATH = ':memory:'
    CACHE_TYPE = 'simple'
    RATE_LIMIT_STORAGE = 'memory://'

    # Disable rate limiting in tests
    RATE_LIMIT_ENABLED = False

    # Fast logging for tests
    LOG_LEVEL = 'ERROR'


# Configuration dictionary
config_by_name = {
    'development': DevelopmentConfig,
    'staging': StagingConfig,
    'production': ProductionConfig,
    'testing': TestingConfig
}


def get_config(env=None):
    """Get configuration based on environment

    Args:
        env (str): Environment name (development, staging, production, testing)
                   If None, reads from FLASK_ENV environment variable

    Returns:
        Config class for the specified environment
    """
    if env is None:
        env = os.getenv('FLASK_ENV', 'development')

    config = config_by_name.get(env.lower(), DevelopmentConfig)

    # Validate production config
    if env.lower() == 'production':
        try:
            config.validate()
        except ValueError as e:
            print(f"⚠️  WARNING: {e}")

    return config


def get_config_value(key, default=None):
    """Get a configuration value from the current environment

    Args:
        key (str): Configuration key
        default: Default value if key not found

    Returns:
        Configuration value
    """
    config = get_config()
    return getattr(config, key, default)
