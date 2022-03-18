from app.abstracts import Area
from app.utils import log


class UseTrigger(Area):
    def __init__(self):
        super().__init__(
            "UseTrigger",
            description="Use the Trigger of the job to execute the reaction",
            params={}
        )

    def happened(self, user_email, **params) -> bool:
        return True


action = UseTrigger()
