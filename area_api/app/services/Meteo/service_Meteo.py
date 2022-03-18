import os

import dotenv

from app.abstracts import Service
from app.services_loader import load_modules

_parent_dir = os.path.dirname(os.path.abspath(__file__))
FLASK_ENV = os.getenv("FLASK_ENV")
if FLASK_ENV is None or FLASK_ENV == "development":
    dotenv.load_dotenv(dotenv_path="secrets.env", verbose=True)
KEY = os.getenv("WEATHER_API_KEY")


class Meteo(Service):
    def __init__(self,
                 name="Meteo",
                 actions=[m.action for m in load_modules(path=_parent_dir + "/actions").values()],
                 reactions=[m.reaction for m in load_modules(path=_parent_dir + "/reactions").values()]):
        super().__init__(name, actions=actions, reactions=reactions)


service = Meteo()
