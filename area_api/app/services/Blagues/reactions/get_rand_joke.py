import requests

from app.abstracts import Area
from app.modules import Emailer
from app.utils import log
from app.services.Blagues.service_Blagues import JOKE_TYPES, AUTH_HEADER


class GetRandJoke(Area):
    def __init__(self):
        super().__init__(
            "GetRandJoke",
            description="",
            params={
                "type": "A joke type (types: global, dev, dark, limit, beauf, blondes)",
                "destination_email": "email address that will receive the joke"
            }
        )
        self.emailer = Emailer()

    def execute(self, user_email, **params):
        try:
            assert params["type"] in JOKE_TYPES
            assert params["destination_email"] is not None
        except KeyError:
            log("ERROR", "GetRandJoke cannot be executed: missing argument(s)")
        except AssertionError:
            log("ERROR", "GetRandJoke cannot be executed: invalid joke type")
        else:
            res = requests.get(
                "https://www.blagues-api.fr/api/type/{type}/random"
                .format(type=params["type"]),
                headers=AUTH_HEADER
            )
            data = res.json()
            try:
                self.emailer.send(
                    params["destination_email"],
                    "Area-tirer services: Joke: " + data["joke"],
                    data["answer"]
                )
            except Exception as e:
                log("ERROR", "Joke could not be sent to",
                    params["destination_email"])
                log("ERROR", e)


reaction = GetRandJoke()
# reaction.execute(type="dev", destination_email="gael2.dorckel@epitech.eu")
