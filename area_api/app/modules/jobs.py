import datetime as dt

from apscheduler.schedulers.background import BackgroundScheduler
from flask import request, abort
from flask_restful import Resource
from schematics.exceptions import DataError

from app import api
from app.abstracts import Job, Trigger
from app.models.job import JobModel
from app.modules import DatabaseAdapter, check_auth
from app.services_loader import get_service_by_name
from app.utils import log

col_name = "jobs"
db: DatabaseAdapter = DatabaseAdapter()


def launch(job: Job) -> None:
    try:
        log("DEBUG", "Action", job.action.name, "triggered")
        if job.action.happened(user_email=job.user_email, **job.action.params):
            rea_index = 0
            for reaction in job.reactions:
                try:
                    log("DEBUG", "Reaction", reaction.name, "triggered")
                    reaction.execute(user_email=job.user_email,
                                     **job.reactions[rea_index].params)
                except Exception as e:
                    log("ERROR", "Reaction {} for user {} failed because: {}"
                        .format(reaction.name, job.user_email, e))
                rea_index += 1
    except Exception as e:
        log("ERROR", "Action {} for user {} failed because: {}"
            .format(job.action.name, job.user_email, e))


def _add(job: Job):
    try:
        trigger_params = job.trigger.params
        for k, v in trigger_params.items():
            if "date" in k:
                trigger_params[k] = dt.datetime.fromtimestamp(v // 1000)
        sched.add_job(
            id=job.user_email + ':' + job.id,
            func=launch,
            args=[job],
            trigger=job.trigger.trigger_type(**trigger_params)
        )
    except Exception as e:
        log("ERROR", e)
        raise DataError({'message': str(e)})


def _create_from_model(job_data: JobModel) -> Job:
    action_class = get_service_by_name(job_data.action.service)\
                     .get_elem_by_name(job_data.action.name, "a").__class__
    action = action_class()
    action.params = job_data.action.params
    reactions_classes = [
        get_service_by_name(reaction.service)
        .get_elem_by_name(reaction.name, "rea").__class__
        for reaction in job_data.reactions
    ]
    reactions = []
    for i in range(len(reactions_classes)):
        reaction = reactions_classes[i]()
        reaction.params = job_data.reactions[i].params
        reactions.append(reaction)
    return Job(
        _id=job_data.id,
        action=action,
        reactions=reactions,
        trigger=Trigger(job_data.trigger._type,
                        **job_data.trigger.params),
        user_email=job_data.user_email
    )


def _init_from_db():
    job_dicts = db.find(col_name)
    for job_dict in job_dicts:
        try:
            job_dict.pop("_id")
            job = _create_from_model(JobModel(job_dict))
            _add(job)
            log("INFO", "Loaded job", job_dict["id"])
        except Exception as e:
            log("ERROR", "Could not load job", job_dict["id"], "because:", e)


sched = BackgroundScheduler()
_init_from_db()
sched.start()


class Jobs(Resource):
    def __init__(self) -> None:
        self.db = db
        self.sched = sched

    def get(self):
        user = check_auth(request)
        if user is None:
            abort(401, description="Invalid authorization token")
        job_dicts = self.db.find(col_name, {"user_email": user["email"]})
        [job_dict.pop("_id") for job_dict in job_dicts]
        return {"jobs": job_dicts}

    def post(self):
        user = check_auth(request)
        if user is None:
            abort(401, description="Invalid authorization token")
        req_body = request.get_json()
        if req_body is None:
            abort(400, description="Could not get JSON from the body")
        try:
            req_body["user_email"] = user["email"]
            job_data = JobModel(req_body)
            job_data.validate()
            # print(req_body)
            if self.db.find_one(
                        col_name,
                        {"id": job_data.id, "user_email": job_data.user_email}
                    ) is not None:
                abort(409, description="Duplicate job ID. Use another.")
            try:
                job = _create_from_model(job_data)
            except Exception as e:
                abort(400, description=str(e))
            _add(job)
            if not self.db.insert_one(col_name, job_data.to_primitive()):
                raise Exception("Error when saving the job. Retry later.")
        except DataError as e:
            abort(400, description=str(e))
        except Exception as e:
            abort(500, description=str(e))
        return job_data.to_primitive()

    def delete(self):
        user = check_auth(request)
        if user is None:
            abort(401, description="Invalid authorization token")

        id_to_del = request.form.get("id")
        delete_all = request.form.get("delete_all")
        filters = {"user_email": user["email"]}
        if (delete_all is None or delete_all == "false")\
                and (id_to_del is None or id_to_del == ""):
            abort(400, "No job id provided & delete_all is false")
        elif delete_all != "true":
            filters.update({"id": id_to_del})

        to_del = self.db.find(col_name, filters)
        if len(to_del) == 0:
            return {"message": "no correponding jobs found"}
        try:
            for job in to_del:
                filters.update({"id": job["id"]})
                self.db.delete_one(col_name, filters)
                try:
                    self.sched.remove_job(user["email"] + ':' + job["id"])
                except Exception:
                    pass
        except Exception as e:
            abort(500, description=str(e))
        return {"message": "successfully deleted {n} job(s): {names}".format(
            n=len(to_del),
            names=", ".join([job["id"] for job in to_del])
        )}


api.add_resource(Jobs, "/jobs")
