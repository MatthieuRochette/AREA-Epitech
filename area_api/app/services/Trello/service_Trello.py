import os

import dotenv
import requests
from flask import request, abort
from flask_restful import Resource
from schematics.exceptions import DataError

from app import api
from app.abstracts import Service
from app.modules import DatabaseAdapter, check_auth
from app.modules.users import gen_rand_str, make_safe_for_response
from app.utils import load_modules
from app.services.Trello.models import LoginForm

col_name = "users"
_parent_dir = os.path.dirname(os.path.abspath(__file__))

FLASK_ENV = os.getenv("FLASK_ENV")
if FLASK_ENV is None or FLASK_ENV == "development":
    dotenv.load_dotenv("secrets.env")
KEY = os.getenv("TRELLO_API_KEY")


class Trello(Service, Resource):
    def __init__(self,
                 name="Trello",
                 actions=[m.action for m in load_modules(path=_parent_dir + "/actions").values()],
                 reactions=[m.reaction for m in load_modules(path=_parent_dir + "/reactions").values()]):
        super().__init__(name, actions=actions, reactions=reactions)
        self.db = DatabaseAdapter()

    def post(self):
        """login"""
        form = LoginForm(request.form)
        try:
            form.validate()
        except DataError as e:
            abort(400, description=str(e))

        # call trello api to get user email
        params = {
            "token": form.token_trello,
            "key": KEY
        }
        res = requests.get(
            "https://api.trello.com/1/members/me",
            params=params
        )
        if res.status_code != 200:
            abort(res.status_code, res.reason)

        # login or create account based on github token and if user found in db
        trello_user = res.json()
        conn_user = check_auth(request, overlook_missing_auth=True)
        user = self.db.find_one(col_name, {"email": trello_user["email"]})
        if user is None and conn_user is None:
            # not logged in & user not found -> new account
            new_user = {
                "name": trello_user["username"],
                "email": trello_user["email"],
                "salt": gen_rand_str(),
                "password": gen_rand_str(),
                "confirmed_account": True,
                "web_token": gen_rand_str(),
                "mobile_token": gen_rand_str(),
                "token_trello": form.token_trello
            }
            try:
                self.db.insert_one(col_name, new_user)
            except Exception as e:
                abort(500, description=str(e))
            return make_safe_for_response(new_user), 202
        elif conn_user is not None:
            # user not found but request with authentication ->
            # use connected user account
            user = conn_user

        # generate a new token if token was empty
        if user["web_token"] == "":
            user["web_token"] = gen_rand_str()
        if user["mobile_token"] == "":
            user["mobile_token"] = gen_rand_str()

        # save token to backend
        user["token_trello"] = form.token_trello
        try:
            self.db.update_one("users", {"_id": user["_id"]}, {"$set": user})
        except Exception as e:
            abort(500, description=str(e))
        return make_safe_for_response(user), 202

    def get(self):
        """logout"""
        user = check_auth(request)
        if user is None:
            abort(401, description="User must be logged in")
        user["token_trello"] = ""
        try:
            self.db.update_one("users", {"_id": user["_id"]}, {"$set": user})
        except Exception as e:
            abort(500, description=str(e))
        return {"message": "Successfully logged out from service Trello"}, 200


if not api.owns_endpoint("trello"):
    api.add_resource(Trello, "/trello")

service = Trello()
