from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.date import DateTrigger
from apscheduler.triggers.interval import IntervalTrigger

class Trigger(object):
    def __init__(self, trigger_type: str, **kwargs) -> None:
        self.params = kwargs
        available_types = {
            "cron": CronTrigger,
            "date": DateTrigger,
            "interval": IntervalTrigger
        }
        try:
            self.trigger_type = available_types[trigger_type]
        except KeyError:
            raise KeyError("The trigger type selected is not available")
