import os

import dotenv

from app.abstracts import Service
from app.utils import load_modules

FLASK_ENV = os.getenv("FLASK_ENV")
if FLASK_ENV is None or FLASK_ENV == "development":
    dotenv.load_dotenv("secrets.env")
BLAGUES_API_KEY = os.getenv("BLAGUES_API_KEY")
AUTH_HEADER = headers = {"Authorization": "Bearer " + BLAGUES_API_KEY}
JOKE_TYPES = ['global', 'dev', 'dark', 'limit', 'beauf', 'blondes']
_parent_dir = os.path.dirname(os.path.abspath(__file__))


class Blague(Service):
    def __init__(self, name="Blague",
                 actions=[m.action for m in load_modules(path=_parent_dir + "/actions").values()],
                 reactions=[m.reaction for m in load_modules(path=_parent_dir + "/reactions").values()]):
        super().__init__(name, actions=actions, reactions=reactions)


service = Blague()
