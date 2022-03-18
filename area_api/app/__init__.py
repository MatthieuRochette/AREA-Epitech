from flask import Flask
from flask_restful import Api
from flask_cors import CORS

app = Flask(__name__)
CORS(app, methods=["GET", "POST", "LINK", "DELETE", "PUT"])
api = Api(app, catch_all_404s=True)

from . import views
