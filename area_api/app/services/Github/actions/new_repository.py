from github import Github

from app.abstracts import Area
from app.modules import DatabaseAdapter
from app.utils import savestate, open_file, log, check_user_logged_to_service


class NewRepo(Area):
    def __init__(self):
        super().__init__(
            "NewRepo",
            description="A new repo is accessible by your account",
            params={}
        )
        self.db = DatabaseAdapter()

    def happened(self, user_email, **params) -> bool:
        user = self.db.find_one("users", {"email": user_email})
        try:
            check_user_logged_to_service(user, "token_github")
        except Exception as e:
            log("ERROR", e)
            return False

        try:
            file_save = str(user["token_github"]) + "_repo.txt"
            g = Github(user["token_github"])
            guser = g.get_user()
            list_repo = []
            count_repo = 0
            old_num_repo = open_file(file_save)
            for repo in guser.get_repos():
                list_repo.append(repo.name)
                count_repo += 1
            if count_repo > old_num_repo:
                log("DEBUG", "Action detect a new repository")
                savestate(list_repo, file_save)
                return True
            else:
                log("DEBUG", "Action detect no new repository")
                return False
        except Exception as e:
            log("ERROR", "can't access the account:", e)
            return False


action = NewRepo()
# action.happened(user_email="")
