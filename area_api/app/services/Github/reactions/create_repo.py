from github import Github

from app.abstracts import Area
from app.modules import DatabaseAdapter
from app.utils import log, check_user_logged_to_service


class CreateRepo(Area):
    def __init__(self):
        super().__init__(
            "CreateRepo",
            description="Create a Github repository",
            params={
                "name": "name of the future repo"
            }
        )
        self.db = DatabaseAdapter()

    def execute(self, user_email, **params):
        user = self.db.find_one("users", {"email": user_email})
        try:
            assert params["name"] is not None
            check_user_logged_to_service(user, "token_github")
        except KeyError:
            log("ERROR", "KeyError: missing argument in CreateRepo")
            return
        except AssertionError:
            log("ERROR", "AssertionError: argument received but empty")
            return

        g = Github(user["token_github"])
        guser = g.get_user()
        for repo in guser.get_repos():
            if repo.full_name.split('/')[1] == params["name"]:
                log("ERROR", "repository already exist")
                log("ERROR", repo.full_name.split('/')[1])
                return
        print(1)
        guser.create_repo(params["name"])
        for repo in guser.get_repos():
            if repo.full_name.split('/')[1] == params["name"]:
                log("DEBUG", "repository create")
                return
        print(2)
        log("ERROR", "repository wasn't create")
        return


reaction = CreateRepo()
# reaction.execute(user_email="", name="test")
