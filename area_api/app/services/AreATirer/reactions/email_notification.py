from app.abstracts import Area
from app.modules import Emailer
from app.utils import log


class EmailNotification(Area):
    def __init__(self):
        super().__init__(
            "EmailNotification",
            description="Get an email notification from our system",
            params={
                "message": "The message you want your notification to carry"
            }
        )
        self.emailer = Emailer()

    def execute(self, user_email, **params):
        try:
            params["message"] = str(params["message"])
            n = len(params["message"]) if len(params["message"]) < 20 else 20
            self.emailer.send(
                user_email,
                "Area-tirer services: Notifiction | " + params["message"][:n] + "...",
                params["message"]
            )
        except KeyError:
            log("ERROR", "EmailNotif cannot be executed: missing argument(s)")
        except AssertionError:
            log("ERROR", "EmailNotif cannot be executed: invalid arg type")
        except Exception as e:
            log("ERROR", "Could not send email notification:", e)


reaction = EmailNotification()
# reaction.execute(user_email="", message="")
