from flask import Flask
from routes import app as routes_app
from config import Config
import logging.config

logging.config.dictConfig(Config.LOGGING_CONFIG)

app = Flask(__name__)
app.register_blueprint(routes_app)

if __name__ == '__main__':
    app.run(debug=True)