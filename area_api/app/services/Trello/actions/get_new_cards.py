import requests

from app.abstracts import Area
from app.modules import DatabaseAdapter
from app.utils import savestate, open_file, log, check_user_logged_to_service
from app.services.Trello.service_Trello import KEY


class NewCards(Area):
    def __init__(self):
        super().__init__(
            "NewCards",
            description="New card created on a given board",
            params={
                "name": "name of the board"
            }
        )
        self.db = DatabaseAdapter()

    def happened(self, user_email, **params) -> bool:
        user = self.db.find_one("users", {"email": user_email})
        try:
            assert params["name"] is not None
            check_user_logged_to_service(user, "token_trello")
        except KeyError:
            log("ERROR", "KeyError: missing argument in Create repo")
            return False
        except Exception as e:
            log("ERROR", e)
            return False

        url = "https://api.trello.com/1/members/me/boards"
        headers = {
          "Accept": "application/json"
        }
        query = {
           'key': KEY,
           'token': user["token_trello"]
        }
        response = requests.request(
           "GET",
           url,
           headers=headers,
           params=query
        )
        if response.status_code != 200:
            log("ERROR", "can't access to the account")
            return(False)
        name_corres = 0
        iden = []
        for part in response.text.split(','):
            if part.split('"')[1] == "name":
                if part.split('"')[3] == params["name"]:
                    name_corres = 1
            if part.split('"')[1] == "id" and part.split('"')[0] == "" and name_corres == 1:
                iden.append(part.split('"')[3])
                break
        if name_corres == 0:
            log("ERROR", "name of board not found")
            return False
        url = "https://api.trello.com/1/boards/" + str(iden[0]) + "/cards"
        response = requests.request(
           "GET",
           url,
           headers=headers,
           params=query
        )
        file_save = str(user["token_trello"]) + "_" + str(params["name"]) + "_cards.txt"
        all_id = []
        cards = 0
        old_cards = open_file(file_save)
        for part in response.text.split(','):
            if part.find("\"id\"") == 1:
                all_id.append(part.split('"')[3])
                cards += 1
        if cards > old_cards:
            log("DEBUG", "Action detect a new card on board")
            savestate(all_id, file_save)
            return True
        return False
        if response.status_code != 200:
            log("ERROR", "can't access to the account")
            return(False)


action = NewCards()
# action.happened(user_email="", name="Arcade")
