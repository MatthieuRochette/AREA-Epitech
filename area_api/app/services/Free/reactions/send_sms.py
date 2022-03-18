import requests

from app.abstracts import Area
from app.modules import DatabaseAdapter
from app.utils import log, check_user_logged_to_service
from app.services.Free.service_Free import free_error_codes


class SendSMS(Area):
    def __init__(self):
        super().__init__(
            "SendSMS",
            description="Send an SMS to your Free phone number",
            params={
                "msg": "message contents"
            }
        )
        self.db = DatabaseAdapter()

    def execute(self, user_email, **params):
        user = self.db.find_one("users", {"email": user_email})
        try:
            assert params["msg"] is not None
            check_user_logged_to_service(user, "free_user")
            check_user_logged_to_service(user, "free_pass")
        except KeyError:
            log("ERROR", "KeyError: missing argument in SendSMS")
            return
        except AssertionError:
            log("ERROR", "AssertionError: argument received but empty")
            return
        except Exception as e:
            log("ERROR", e)
            return

        params["user"] = user["free_user"]
        params["pass"] = user["free_pass"]
        r = requests.get(
            "https://smsapi.free-mobile.fr/sendmsg",
            params=params
        )
        if r.status_code != 200:
            log("ERROR", "Error when trying to send SMS")
            log("ERROR", r.status_code, free_error_codes[r.status_code])


reaction = SendSMS()
# test_dict = {"user":"34159432", "passwd":"cTMSU36CT5fIqi", "msg":"test lolilol"}
# reaction.execute(user_email="matthieu.rochette@epitech.eu", **test_dict)