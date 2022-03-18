from .area import Area
from .trigger import Trigger


class Job(object):
    def __init__(self, _id, action, reactions, trigger, user_email) -> None:
        self.id = _id
        self.action: Area = action
        self.reactions: list = reactions
        self.trigger: Trigger = trigger
        self.user_email = user_email
        self.action_ret_val = {}
