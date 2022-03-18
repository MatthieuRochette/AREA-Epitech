from schematics import Model
from schematics.types import StringType


class LoginForm(Model):
    token_trello = StringType(required=True)
