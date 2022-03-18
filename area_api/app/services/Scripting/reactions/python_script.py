from app.abstracts import Area
from app.utils import log


class PythonScript(Area):
    def __init__(self):
        super().__init__(
            "PythonScript",
            description="Execute a python script",
            params={
                "script": "The python script to execute"
            }
        )

    def execute(self, user_email, **params):
        try:
            assert params["script"] is not None
        except KeyError:
            log("ERROR", "KeyError: missing argument in PythonScript")
            return
        except AssertionError:
            log("ERROR", "AssertionError: argument received but empty")
            return
        try:
            log("INFO", "Executing a Python script")
            exec(params["script"])
        except Exception as e:
            log("ERROR", e)


reaction = PythonScript()
