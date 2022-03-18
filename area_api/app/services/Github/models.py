from schematics import Model
from schematics.types import StringType


class LoginForm(Model):
    token_github = StringType(required=True)
