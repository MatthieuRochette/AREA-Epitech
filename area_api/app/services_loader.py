import os

from app.abstracts import Service
from app.utils import load_modules


def load_services(path="app/services"):
    services = {}
    for dir_content in os.listdir(path):
        abs_path = os.path.abspath(os.path.join(path, dir_content))
        if os.path.isdir(abs_path):
            services.update(load_modules(abs_path, prefix="service_"))
    return services


def get_service_by_name(name, services: dict = load_services()) -> Service:
    for module in services.values():
        if module.service.name == name:
            return module.service
