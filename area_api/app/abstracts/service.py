from app.utils import log
from .area import Area


class Service(object):
    def __init__(self, name, actions=[], reactions=[]):
        self.name = name
        self.actions = actions
        self.reactions = reactions
        self.a_dict = [action.as_dict() for action in self.actions]
        self.a_full_dict = [action.as_dict_full() for action in self.actions]
        self.rea_dict = [reaction.as_dict() for reaction in self.reactions]
        self.rea_full_dict = [reaction.as_dict_full() for reaction in self.reactions]

    def get_elem_by_name(self, name, area="area") -> Area:
        log("DEBUG", "Looking for area:", name, "in service:", self.name)
        if area == "a":
            area_list = [*self.actions]
        elif area == "rea":
            area_list = [*self.reactions]
        else:
            area_list = [*self.actions, *self.reactions]

        for elem in area_list:
            if elem.name == name:
                return elem
        raise KeyError("invalid action or reaction name")

    def as_dict(self):
        return {
            "name": self.name,
            "actions": self.a_dict,
            "reactions": self.rea_dict
        }

    def as_full_dict(self):
        return {
            "name": self.name,
            "actions": self.a_full_dict,
            "reactions": self.rea_full_dict
        }
