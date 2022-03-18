class Area(object):
    def __init__(self, name, description="", **params):
        self.name = name
        self.description = description
        self.params = params

    def as_dict(self):
        return {
            "name": self.name,
            "description": self.description
        }

    def as_dict_full(self):
        if len(self.params) == 0:
            return {
                "name": self.name,
                "description": self.description,
                "params": {}
            }
        return {
            "name": self.name,
            "description": self.description,
            **self.params
        }

    # override only for action instances
    def happened(self, user_email, **params) -> bool:
        raise TypeError("This Area instance is not an action")

    # override only for reaction instances
    def execute(self, user_email, **params):
        raise TypeError("This Area instance is not a reaction")
