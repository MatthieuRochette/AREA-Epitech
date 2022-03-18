import json
import time
from os import getenv

from flask import request
from dotenv import load_dotenv

from . import app, modules
from .abstracts import Service, Area
from .modules import DatabaseAdapter, users
from .services_loader import load_services
from .utils import log

load_dotenv()
service_modules = load_services()
about_base = {
    "client": {
        "host": "10.101.53.35"
    },
    "server": {
        "current_time": 1531680780,
        "services": []
    }
}


@app.route("/")
def index():
    return '<img src="https://images-cdn.9gag.com/images/thumbnail-facebook/36920293_1495423128.4495_u5ApUn_n.jpg"/></br>Hello there !'


@app.route("/about.json")
def about():
    # copy the base model to preserve it from changing
    about = about_base.copy()
    if getenv("FLASK_ENV") == "production":
        about["client"]["host"] = request.headers.get("X-Forwarded-For")
    else:
        about["client"]["host"] = request.remote_addr
    log("INFO", "Client", request.remote_addr, "asked for about.json")
    about["server"]["current_time"] = int(time.time())
    about["server"]["services"] = [module.service.as_dict()
                                   for module in service_modules.values()]
    res = app.response_class(
        response=json.dumps(about),
        status=200,
        mimetype="application/json"
    )
    return res


@app.route("/area-params.json")
def area_params():
    # copy the base model to preserve it from changing
    about = about_base.copy()
    if getenv("FLASK_ENV") == "production":
        about["client"]["host"] = request.headers.get("X-Forwarded-For")
    else:
        about["client"]["host"] = request.remote_addr
        log("DEBUG", "Client", request.remote_addr, "asked for about.json")
    about["server"]["current_time"] = int(time.time())
    about["server"]["services"] = [module.service.as_full_dict()
                                   for module in service_modules.values()]
    res = app.response_class(
        response=json.dumps(about),
        status=200,
        mimetype="application/json"
    )
    return res
