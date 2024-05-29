import os

class Config:
    UPLOAD_FOLDER = 'uploads'
    LOG_FOLDER = 'logs'
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(LOG_FOLDER, exist_ok=True)
    LOGGING_CONFIG = {
        'version': 1,
        'formatters': {
            'default': {
                'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            },
        },
        'handlers': {
            'file': {
                'class': 'logging.FileHandler',
                'filename': os.path.join(LOG_FOLDER, 'app.log'),
                'formatter': 'default',
            },
            'console': {
                'class': 'logging.StreamHandler',
                'formatter': 'default',
            },
        },
        'root': {
            'level': 'INFO',
            'handlers': ['file', 'console'],
        },
    }