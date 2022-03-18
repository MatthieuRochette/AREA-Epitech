import os

from app.abstracts import Service
from app.services_loader import load_modules

_parent_dir = os.path.dirname(os.path.abspath(__file__))


class Scripting(Service):
    def __init__(self,
                 name="Scripting",
                 actions=[m.action for m in load_modules(path=_parent_dir + "/actions").values()],
                 reactions=[m.reaction for m in load_modules(path=_parent_dir + "/reactions").values()]):
        super().__init__(name, actions, reactions)


service = Scripting()
