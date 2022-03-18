import datetime as dt
from os import getenv

import dotenv

FLASK_ENV = getenv("FLASK_ENV")
if FLASK_ENV is None or FLASK_ENV == "development":
    dotenv.load_dotenv(dotenv_path=".env", verbose=True)

# values for debug_level are DEBUG(0), INFO(1), WARNING(2), ERROR(3)
# the logs only show the logs with the debug_level value or higher
debug_level = getenv("DEBUG_LEVEL")
debug_hierarchy = {
    "DEBUG": 0,
    "INFO": 1,
    "WARNING": 2,
    "ERROR": 3
}
sep = " | "


def log(level: str, *msg, **kwargs):
    try:
        if debug_hierarchy[level] >= debug_hierarchy[debug_level]:
            print(dt.datetime.now(), sep, level, *msg, **kwargs)
    except KeyError:
        print(dt.datetime.now(), sep, level, *msg, **kwargs)
