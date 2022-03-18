from schematics import Model
from schematics.types import StringType


class LoginForm(Model):
    user = StringType(required=True)
    _pass = StringType(required=True)


logged_in_to_service = "Hello {name} ! You have successfully logged in your Free SMS Notification service to Area-tirer."
