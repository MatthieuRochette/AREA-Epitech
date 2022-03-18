import requests

from app.abstracts import Area
from app.utils import log
from app.services.Meteo.service_Meteo import KEY


class weather_description(Area):
    def __init__(self):
        super().__init__(
            "weather description",
            description="this action permissed to get if the weather is sunny",
            params={
                "city": "location of your position"
            }
        )
        self.url = "http://api.openweathermap.org/data/2.5/weather"
        self.headers = {
            "Accept": "application/json"
        }

    def happened(self, user_email, **params) -> bool:
        try:
            assert params["city"] is not None
        except KeyError:
            log("ERROR", "KeyError: missing argument in Create repo")
            return False
        query = {
           'q': params["city"],
           'units': 'metric',
           'appid': KEY,
           'lang': 'fr'
        }
        response = requests.request(
           "GET",
           self.url,
           headers=self.headers,
           params=query
        )
        if response.status_code != 200:
            log("ERROR", "can't access to the weather")
            return False
        for line in response.text.split(','):
            if line.find('description') == 1:
                if line.split('"')[3] == "ciel dégagé":
                    log("DEBUG", "Action detect a sunny weather")
                    return True
        log("DEBUG", "Action detect a none sunny weather")
        return False


action = weather_description()
