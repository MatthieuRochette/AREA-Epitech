import os

import dotenv
import requests
from flask import request, abort
from flask_restful import Resource
from github import Github as GithubApi
from schematics.exceptions import DataError

from app import api
from app.abstracts import Service
from app.modules import DatabaseAdapter, check_auth
from app.modules.users import gen_rand_str, make_safe_for_response
from app.utils import load_modules
from app.services.Github.models import LoginForm

col_name = "users"
_parent_dir = os.path.dirname(os.path.abspath(__file__))
FLASK_ENV = os.getenv("FLASK_ENV")
if FLASK_ENV is None or FLASK_ENV == "development":
    dotenv.load_dotenv("secrets.env")
CLIENT = os.getenv("GITHUB_CLIENT")
SECRET = os.getenv("GITHUB_SECRET")


class Github(Service, Resource):
    def __init__(self,
                 name="Github",
                 actions=[m.action for m in load_modules(path=_parent_dir + "/actions").values()],
                 reactions=[m.reaction for m in load_modules(path=_parent_dir + "/reactions").values()]):
        super().__init__(name, actions=actions, reactions=reactions)
        self.db = DatabaseAdapter()

    def _login(self, token_github):
        # call github api to get user email
        try:
            g = GithubApi(token_github)
            guser = g.get_user()
            emails = guser.get_emails()
        except Exception as e:
            abort(401, description=str(e))

        # login or create account based on github token and if user found in db
        conn_user = check_auth(request, overlook_missing_auth=True)
        for email in emails:
            if email["primary"] is True:
                user = self.db.find_one(col_name, {"email": email["email"]})
                if user is None and conn_user is None:
                    # not logged in & user not found -> new account
                    new_user = {
                        "name": guser.login,
                        "email": email["email"],
                        "salt": gen_rand_str(),
                        "password": gen_rand_str(),
                        "confirmed_account": True,
                        "web_token": gen_rand_str(),
                        "mobile_token": gen_rand_str(),
                        "token_github": token_github
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
                break

        # generate a new token if token was empty
        if user["web_token"] == "":
            user["web_token"] = gen_rand_str()
        if user["mobile_token"] == "":
            user["mobile_token"] = gen_rand_str()

        # save token to backend
        user["token_github"] = token_github
        try:
            self.db.update_one(col_name, {"_id": user["_id"]}, {"$set": user})
        except Exception as e:
            abort(500, description=str(e))
        return make_safe_for_response(user), 202

    def post(self):
        """login"""
        form = LoginForm(request.form)
        try:
            form.validate()
        except DataError as e:
            abort(400, description=str(e))
        return self._login(form.token_github)

    def get(self):
        """logout"""
        user = check_auth(request)
        if user is None:
            abort(401, description="User must be logged in")
        user["token_github"] = ""
        try:
            self.db.update_one("users", {"_id": user["_id"]}, {"$set": user})
        except Exception as e:
            abort(500, description=str(e))
        return {"message": "Successfully logged out from service github"}, 200

    def put(self):
        "OAuth, go fuck yourself"
        try:
            assert request.args.get("code") is not None
            assert request.args.get("code") != ""
            res = requests.post(
                "https://github.com/login/oauth/access_token",
                params={
                    "client_id": CLIENT,
                    "client_secret": SECRET,
                    "code": request.args.get("code"),
                },
                headers={"Accept": "application/json"}
            )
        except AssertionError as e:
            abort(400, e)
        except Exception as e:
            abort(500, e)
        if res.status_code != 200:
            abort(res.status_code, res.reason)
        data = res.json()
        return self._login(data["access_token"])


if not api.owns_endpoint("github"):
    api.add_resource(Github, "/github")

service = Github()
