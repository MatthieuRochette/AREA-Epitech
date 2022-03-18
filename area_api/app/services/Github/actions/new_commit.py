from github import Github

from app.abstracts import Area
from app.modules import DatabaseAdapter
from app.utils import log, savestate, open_file, check_user_logged_to_service


class NewCommit(Area):
    def __init__(self):
        super().__init__(
            "NewCommit",
            description="A new commit is detected on a project",
            params={
                "name": "name of the repository (format: organisation/repo)"
            }
        )
        self.db = DatabaseAdapter()

    def happened(self, user_email, **params) -> bool:
        user = self.db.find_one("users", {"email": user_email})
        try:
            assert params["name"] is not None
            check_user_logged_to_service(user, "token_github")
        except KeyError:
            log("ERROR", "KeyError: missing argument in new colaborator")
            return False
        except AssertionError:
            log("ERROR", "AssertionError: argument received but empty")
            return False
        except Exception as e:
            log("ERROR", e)
            return False

        try:
            g = Github(user["token_github"])
            repo = g.get_repo(params["name"])
            new_commits = []
            file_save = str(user["token_github"]) + "_" + str(params["name"]).replace("/", "_") + "_commits" + ".txt"
            old_num_commit = open_file(file_save)
            for commit in repo.get_commits():
                if commit.commit is not None:
                    new_commits.append(commit.commit.author.date)
                    new_commits.append(commit.commit.author.email)
                    new_commits.append(commit.commit.message)
            if len(new_commits) > old_num_commit:
                log("DEBUG", "Action detect a new commit")
                savestate(new_commits, file_save)
                return True
            log("DEBUG", "Action detect no new commit")
            return False
        except Exception as e:
            log("ERROR", "can't access the account or repository", e)
            return False


action = NewCommit()
# action.happened(user_email="", name="eliaStrasbourg/Test_are")
