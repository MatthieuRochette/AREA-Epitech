from hashlib import pbkdf2_hmac
from os import urandom, getenv
from random import choice
from string import hexdigits

from flask import request, abort
from flask_restful import Resource
from schematics.exceptions import DataError

from app import api
from app.models.users import RegistrationForm, LoginForm
from app.modules import DatabaseAdapter, Emailer
from app.models.emails import sign_in_html, sign_in_txt, account_deleted_txt,\
                              account_deleted_html
from app.utils import log

db = DatabaseAdapter()
emailer = Emailer()
col_name = "users"
HOST = getenv("HOST")
confirm_template_url = "http://" + HOST + ":8081/confirm_account?token="


def gen_rand_str(length=64):
    s = ""
    while len(s) < length:
        s += choice(hexdigits)
    return s


def make_safe_for_response(doc) -> dict:
    to_rm = ["password", "salt", "_id", "free_pass", "token_github", "token_trello"]
    for item in to_rm:
        try:
            doc.pop(item)
        except KeyError:
            pass
    return doc


def create_hash(password, salt=urandom(32)):
    hashed = pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 150000)
    return salt, hashed


def compare_hash(password, salt, hashed):
    _, test_pw = create_hash(password, salt=salt)
    return test_pw == hashed


def check_auth(req, overlook_missing_auth=False) -> dict:
    auth = req.headers.get("Authorization")
    if auth is None:
        if not overlook_missing_auth:
            abort(401, description="No bearer token provided")
        return None

    try:
        recv_token = auth.split(" ")[1]
        web_user = db.find_one(col_name, {"web_token": recv_token})
        mobile_user = db.find_one(col_name, {"mobile_token": recv_token})
    except Exception as e:
        abort(500, description=str(e))
    else:
        if web_user is not None:
            return web_user
        elif mobile_user is not None:
            return mobile_user
        else:
            return None


class User(Resource):
    def link(self):
        """login the user"""
        try:
            form = LoginForm(request.form)
            form.validate()
        except DataError as e:
            abort(400, description=str(e))

        user_doc = db.find_one(col_name, {"email": form.email})
        if user_doc is None:
            abort(401, description="User not registered or invalid email")
        if not compare_hash(form.password, user_doc["salt"],
                            user_doc["password"]):
            abort(401, description="Email and password do not match")
        if not user_doc["confirmed_account"]:
            abort(401, description="Account must be confirmed before login")

        if form.mobile is True:
            token_type = "mobile_token"
            user_doc["web_token"] = ""
        else:
            token_type = "web_token"
            user_doc["mobile_token"] = ""
        user_doc[token_type] = gen_rand_str()
        try:
            db.update_one(
                col_name, {"_id": user_doc["_id"]}, {"$set": user_doc})
        except Exception as e:
            abort(500, description=str(e))
        else:
            log("INFO", "User", user_doc["email"], "logged in")
            return make_safe_for_response(user_doc), 202

    def get(self):
        """logout the user"""
        user = check_auth(request)
        if user is None:
            abort(401, description="Invalid auhtorization token (not up to"
                  + " date ? try logging in again)")

        try:
            user["web_token"] = ""
            user["mobile_token"] = ""
            db.update_one(col_name, {"_id": user["_id"]}, {"$set": user})
        except Exception as e:
            abort(500, description=str(e))
        else:
            log("INFO", "User", user["_id"], "logged out")
            return {"message": "Successfully logged out"}, 200

    def post(self):
        """register the user"""
        form = RegistrationForm(request.form)
        try:
            form.validate()
        except DataError as e:
            abort(400, description=str(e))
        if len(db.find(col_name, {"email": form.email})) > 0:
            abort(409, description="User already registered")

        try:
            salt, hashed = create_hash(form.password)
            confirm_token = gen_rand_str(16)
            user_doc = {
                "name": form.name,
                "email": form.email,
                "salt": salt,
                "password": hashed,
                "confirmed_account": False,
                "web_token": confirm_token,
                "mobile_token": confirm_token
            }
            emailer.send(
                recv_addr=user_doc["email"],
                subj="Area-tirer: please confirm your account",
                txt=sign_in_txt.format(
                    name=user_doc["name"],
                    link=confirm_template_url+confirm_token
                ),
                html=sign_in_html.format(
                    name=user_doc["name"],
                    link=confirm_template_url+confirm_token
                )
            )
            db.insert_one(col_name, user_doc.copy())
        except Exception as e:
            abort(500, description=str(e))
        else:
            log("INFO", "User (email:", user_doc["email"], ") signed in")
            return make_safe_for_response(user_doc), 201

    def put(self):
        """confirm_account"""
        user = check_auth(request)
        if user["confirmed_account"]:
            return {"message": "account already confirmed"}, 200
        if user is None:
            abort(401, description="Invalid authorization token")

        try:
            user["confirmed_account"] = True
            db.update_one(col_name, {"_id": user["_id"]}, {"$set": user})
        except Exception as e:
            abort(500, description=str(e))
        else:
            return {"message": "account confirmed"}, 200

    def delete(self):
        """delete the user"""
        user = check_auth(request)
        if user is None:
            abort(401, description="Invalid authorization token (not logged in"
                  + " or account already deleted)")
        elif not user["confirmed_account"]:
            abort(401, description="Account has to be confirmed")

        try:
            db.delete_one(col_name, user)
        except Exception as e:
            abort(500, str(e))
        else:
            emailer.send(
                recv_addr=user["email"],
                subj="Area-tirer: your account has been deleted",
                txt=account_deleted_txt.format(name=user["name"]),
                html=account_deleted_html.format(name=user["name"])
            )
            # add deletion of saved jobs
            return {"message": "Deleted account " + str(user["_id"])},\
                200


api.add_resource(
    User, "/user", methods=["GET", "LINK", "POST", "PATCH", "PUT", "DELETE"]
)
