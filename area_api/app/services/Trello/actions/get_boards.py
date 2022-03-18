import requests

from app.abstracts import Area
from app.modules import DatabaseAdapter
from app.utils import savestate, open_file, log, check_user_logged_to_service
from app.services.Trello.service_Trello import KEY


class NewBoard(Area):
    def __init__(self):
        super().__init__(
            "NewBoard",
            description="Detect access to a new Board",
            params={}
        )
        self.db = DatabaseAdapter()
        self.url = "https://api.trello.com/1/members/me/boards"
        self.headers = {
          "Accept": "application/json"
        }

    def happened(self, user_email, **params) -> bool:
        user = self.db.find_one("users", {"email": user_email})
        try:
            check_user_logged_to_service(user, "token_trello")
        except Exception as e:
            log("ERROR", e)
            return False

        query = {
           'key': KEY,
           'token': user["token_trello"]
        }
        response = requests.request(
           "GET",
           self.url,
           headers=self.headers,
           params=query
        )
        if response.status_code != 200:
            log("ERROR", "can't access to the account")
            return False
        file_save = str(user["token_trello"]) + "_board.txt"
        list_board = []
        count_board = 0
        old_num_board = open_file(file_save)
        for part in response.text.split(','):
            if part.split('"')[1] == "name":
                list_board.append(part.split('"')[3])
                count_board += 1
        if count_board > old_num_board:
            log("DEBUG", "Action detect a new board")
            savestate(list_board, file_save)
            return True
        return False


action = NewBoard()
# action.happened()
