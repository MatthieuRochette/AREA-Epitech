from schematics import Model
from schematics.types import StringType, EmailType, BooleanType
from schematics.exceptions import ValidationError


class RegistrationForm(Model):
    name = StringType(required=True)
    email = EmailType(required=True)
    password = StringType(required=True, min_length=8)
    confirm_pw = StringType(required=True)

    def validate_password(self, data, value):
        if data['password'] != data['confirm_pw']:
            raise ValidationError(u"Passwords do not match")
        return value


class LoginForm(Model):
    email = EmailType(required=True)
    password = StringType(required=True)
    mobile = BooleanType(required=False, default=False)
