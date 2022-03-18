from app.abstracts import Area
from app.modules import DatabaseAdapter
from app.utils import savestate, open_file
from app.utils import log, check_user_logged_to_service
from github import Github


class NewCollaborator(Area):
    def __init__(self):
        super().__init__(
            "NewCollaborator",
            description="A new collaborator was added to the repository",
            params={
                "name": "name of the repository (format: user/repo OR organisation/repo)"
            }
        )
        self.db = DatabaseAdapter()

    def happened(self, user_email, **params) -> bool:
        user = self.db.find_one("users", {"email": user_email})
        try:
            assert params["name"] is not None
            check_user_logged_to_service(user, "token_github")
        except KeyError:
            log("ERROR", "KeyError: missing argument in new collaborator")
            return False
        except AssertionError:
            log("ERROR", "AssertionError: argument received but empty")
            return False
        except Exception as e:
            log("ERROR", e)
            return False

        try:
            file_save = str(user["token_github"]) + "_" + str(params["name"]).replace("/", "_") + "_collaborator" + ".txt"
            g = Github(user["token_github"])
            repo = g.get_repo(params["name"])
            collaborators = repo.get_collaborators()
            list_colab = []
            old_user_count = open_file(file_save)
            colab = collaborators.totalCount
            for collaborator in collaborators:
                list_colab.append(collaborator.login)
            if colab > old_user_count:
                log("DEBUG", "Action detect a new repository")
                savestate(list_colab, file_save)
                return True
            return False
        except Exception as e:
            log("ERROR", "NewCollaborator error:", e)
            return False


action = NewCollaborator()
# action.happened(user_email="", name="eliaStrasbourg/Test_are")
