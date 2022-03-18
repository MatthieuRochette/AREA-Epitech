import requests

from app.abstracts import Area
from app.modules import Emailer
from app.utils import log


class ExternalAPI(Area):
    def __init__(self):
        super().__init__(
            "External API",
            description="Call an external API",
            params={
                "type_request": "precise type of request GET/POST etc",
                "url": "URL for the API request (including URL parameters)"
            }
        )
        self.emailer = Emailer()

    def execute(self, user_email, **params):
        try:
            assert params["type_request"] is not None
            assert params["type_request"] in ["GET", "OPTIONS", "HEAD", "POST", "PUT", "PATCH", "DELETE"]
            assert params["url"] is not None
        except KeyError:
            log("ERROR", "KeyError: missing argument in interact api")
            return
        except AssertionError:
            log("ERROR", "AssertionError: Argument is empty or invalid")
            return
        try:
            response = requests.request(
               params["type_request"],
               params["url"]
            )
            self.emailer.send(
                user_email,
                "AreATirer Services: External API call: Status " + str(response.status_code),
                response.text,
                response.text
            )
            if response.status_code != 200:
                log("ERROR", "Error with one of the parameters")
                if len(response.text) == 0:
                    log("ERROR", "Error with type_request")
                else:
                    log("ERROR", "Error with params")
                return
            return
        except Exception:
            log("ERROR", "Error with url")
            return


reaction = ExternalAPI()
# reaction.execute(user_email="elia.belkacem@epitech.eu", type_request="GET", url="http://api.openweathermap.org/data/2.5/weather", params={'appid': 'fe7bcd66a56c61a8089e9180db1a8f99', 'lang': 'fr'})
