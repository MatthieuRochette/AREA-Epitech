import requests

from app.abstracts import Area
from app.modules import DatabaseAdapter
from app.services.Trello.service_Trello import KEY
from app.utils import log


class CreateBoard(Area):
    def __init__(self):
        super().__init__(
            "CreateBoard",
            description="Create a board on trello",
            params={
                "name": "name of the future board"
            }
        )
        self.db = DatabaseAdapter()
        self.trello_error_codes = {
            400: "Bad syntax",
            401: "token error",
            402: "Rate limiting",
            403: "Unauthorized (disabled on service, or wrong auth)",
            500: "Server error"
        }
        self.url = "https://api.trello.com/1/boards/"
        self.headers = {
          "Accept": "application/json"
        }

    def execute(self, user_email, **params):
        user = self.db.find_one("users", {"email": user_email})
        try:
            assert params["name"] is not None
        except KeyError:
            log("ERROR", "KeyError: missing argument in Create repo")
            return
        except AssertionError:
            log("ERROR", "AssertionError: argument received but empty")
            return
        except Exception as e:
            log("ERROR", e)
            return

        query = {
           'key': KEY,
           'token': user["token_trello"],
           'name': params["name"]
        }
        r = requests.request(
           "POST",
           self.url,
           headers=self.headers,
           params=query
        )
        if r.status_code == 200:
            log("DEBUG", "create board")
        else:
            log("ERROR", "Error when create board")
            log("ERROR", r.status_code, self.trello_error_codes[r.status_code])


reaction = CreateBoard()
# no error possible
# reaction.execute(user_email="", name="test")
