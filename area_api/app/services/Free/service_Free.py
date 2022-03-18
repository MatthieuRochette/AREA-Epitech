import os

import requests
from flask import request, abort
from flask_restful import Resource
from schematics.exceptions import DataError

from app import api
from app.abstracts import Service
from app.modules import DatabaseAdapter, check_auth
from app.utils import load_modules
from app.services.Free.models import logged_in_to_service, LoginForm

free_error_codes = {
    400: "Bad syntax",
    402: "Rate limiting",
    403: "Service pas activé sur l'espace abonné OU user/pass incorrects",
    500: "Erreur côté serveur"
}
_parent_dir = os.path.dirname(os.path.abspath(__file__))


class Free(Service, Resource):
    def __init__(self,
                 name="Free",
                 actions=[m.action for m in load_modules(path=_parent_dir + "/actions").values()],
                 reactions=[m.reaction for m in load_modules(path=_parent_dir + "/reactions").values()]):
        super().__init__(name, actions, reactions)
        self.db = DatabaseAdapter()

    def post(self):
        """login"""
        user = check_auth(request)
        if user is None:
            abort(401, description="User must be logged in")
        form = LoginForm(request.form)
        try:
            form.validate()
        except DataError as e:
            abort(400, description=str(e))

        user["free_user"] = form.user
        user["free_pass"] = form._pass
        try:
            self.db.update_one("users", {"_id": user["_id"]}, {"$set": user})
        except Exception as e:
            abort(500, description=str(e))
        params = {
            "user": form.user,
            "pass": form._pass,
            "msg": logged_in_to_service.format(name=user["name"])
        }
        res = requests.get(
            "https://smsapi.free-mobile.fr/sendmsg", params=params
        )
        if res.status_code != 200:
            abort(res.status_code, free_error_codes[res.status_code])
        return {"message": "Service successfully logged in"}, 200

    def get(self):
        """logout"""
        user = check_auth(request)
        if user is None:
            abort(401, description="User must be logged in")
        user["free_user"] = ""
        user["free_pass"] = ""
        try:
            self.db.update_one("users", {"_id": user["_id"]}, {"$set": user})
        except Exception as e:
            abort(500, description=str(e))
        return {"message": "Successfully logged out from service Free"}, 200


if not api.owns_endpoint("free"):
    api.add_resource(Free, "/free")

service = Free()
