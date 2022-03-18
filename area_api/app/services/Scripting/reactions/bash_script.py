import subprocess

from app.abstracts import Area
from app.utils import log


class BashScript(Area):
    def __init__(self):
        super().__init__(
            "BashScript",
            description="Execute a BASH script",
            params={
                "script": "The BASH script to execute"
            }
        )

    def execute(self, user_email, **params):
        try:
            assert params["script"] is not None
        except KeyError:
            log("ERROR", "KeyError: missing argument in BashScript")
            return
        except AssertionError:
            log("ERROR", "AssertionError: argument received but empty")
            return
        try:
            log("INFO", "Executing a Bash script:", params["script"])
            subprocess.run("dir")
            subprocess.run(params["script"])
        except Exception as e:
            log("ERROR", e)


reaction = BashScript()
