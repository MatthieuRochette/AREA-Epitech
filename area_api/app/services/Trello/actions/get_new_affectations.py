import requests

from app.abstracts import Area
from app.modules import DatabaseAdapter
from app.utils import savestate, open_file, log, check_user_logged_to_service
from app.services.Trello.service_Trello import KEY


class NewAffectation(Area):
    def __init__(self):
        super().__init__(
            "NewAffectation",
            description="Detect a new task affectation on a given board",
            params={
                "name": "name of the board"
            }
        )
        self.db = DatabaseAdapter()
        self.url_boards = "https://api.trello.com/1/members/me/boards"
        self.url_tokens = "https://api.trello.com/1/tokens/{}"
        self.url_cards = "https://api.trello.com/1/boards/{}/cards"
        self.url_members = "https://api.trello.com/1/cards/{}/members"
        self.headers = {
          "Accept": "application/json"
        }

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

        query = {
           'key': KEY,
           'token': user["token_trello"]
        }
        response = requests.request(
           "GET",
           self.url_boards,
           headers=self.headers,
           params=query
        )
        if response.status_code != 200:
            log("ERROR", "can't access to the account")
            return False

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
        response = requests.request(
           "GET",
           self.url_tokens.format(str(user["token_trello"])),
           headers=self.headers,
           params=query
        )
        if response.status_code != 200:
            log("ERROR", "can't access to the account")
            return False
        id_user = []
        for part in response.text.split(','):
            if part.split('"')[1] == "idMember":
                id_user.append(part.split('"')[3])
                break
        response = requests.request(
           "GET",
           self.url_cards.format(str(iden[0])),
           headers=self.headers,
           params=query
        )
        if response.status_code != 200:
            log("ERROR", "can't access to the account")
            return False
        file_save = str(user["token_trello"]) + "_" + str(params["name"]) + "_attribution.txt"
        all_id = []
        id_cards = []
        cards = 0
        old_cards = open_file(file_save)
        for part in response.text.split(','):
            if part.find("\"id\"") == 1:
                all_id.append(part.split('"')[3])
        for id in all_id:
            res = requests.request(
               "GET",
               self.url_members.format(str(id)),
               headers=self.headers,
               params=query
            )
            if res.status_code != 200:
                log("ERROR", "can't access to the account")
                return False
            for part in res.text.split(','):
                if part.split('"')[1] == "id":
                    if str(id_user[0]) == part.split('"')[3]:
                        id_cards.append(id)
                        cards += 1
        if cards > old_cards:
            log("DEBUG", "Action detect a new card on board")
            savestate(all_id, file_save)
            return True
        else:
            log("DEBUG", "no new affectation")
            return False


action = NewAffectation()
# action.happened(user_email="", name="Arcade")
