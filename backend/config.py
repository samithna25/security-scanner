import os

class Config:
    """Base configurations containing settings applicable to all environments."""
    # Server network settings
    PORT = int(os.getenv("PORT", 5000))
    HOST = os.getenv("HOST", "0.0.0.0")
    
    # Scanner timeout and retry limit parameters
    SCAN_TIMEOUT = float(os.getenv("SCAN_TIMEOUT", 5.0))
    MAX_REDIRECTS = int(os.getenv("MAX_REDIRECTS", 5))

class DevelopmentConfig(Config):
    """Configurations specific to local development."""
    DEBUG = True

class ProductionConfig(Config):
    """Configurations specific to live production deployment."""
    DEBUG = False

# Mapping environment names to their corresponding config classes
config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig
}

# 1. Determine environment ('development', 'production') from environment variables
ENV_MODE = os.getenv("FLASK_ENV", "default").lower()

# 2. Select active configuration class
active_config = config_by_name.get(ENV_MODE, DevelopmentConfig)