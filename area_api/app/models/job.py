from schematics import Model
from schematics.types.base import StringType, IntType
from schematics.types.compound import ModelType, DictType, ListType


class AreaModel(Model):
    service = StringType(required=True)
    name = StringType(required=True)
    params = DictType(StringType, required=False)


class TriggerModel(Model):
    _type = StringType(required=True)
    params = DictType(IntType, required=False)


class JobModel(Model):
    id = StringType(required=True)
    action = ModelType(AreaModel, required=True)
    reactions = ListType(ModelType(AreaModel, required=True), required=True)
    user_email = StringType(required=True)
    trigger = ModelType(TriggerModel, required=True)
