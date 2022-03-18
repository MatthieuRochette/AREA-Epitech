import requests

from app.abstracts import Area
from app.utils import log
from app.services.Meteo.service_Meteo import KEY


class negative_temperature(Area):
    def __init__(self):
        super().__init__(
            "Negative temperature",
            description="Check if the temperature id below 0°C",
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
            if line.find('main') == 1 and len(line.split(':')) > 2:
                if float(line.split(':')[2]) <= 0:
                    log("DEBUG", "Action detect a negative temperature")
                    return True
        log("DEBUG", "Action detect a positive temperature")
        return False


action = negative_temperature()
# action.happened(city="alaska")
