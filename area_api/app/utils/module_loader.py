import os
import importlib


# This function will load modules from a path and return them
# as a dictionary:
#    - keys are parsed from the filenames
#    - values are the loaded modules
# You can also define a prefix and suffix for the file names, if you want to
# select only a few files with a pattern in their name.
# Look at the server configuration loading in settings.py for an example.
def load_modules(path, prefix="", suffix=".py") -> dict:
    # get the files to load as configs
    files = {
        f for f in os.listdir(path)
            if os.path.isfile(os.path.join(path, f))
                and f.startswith(prefix)
                and f.endswith(suffix)
    }

    # create the dict that will contain the loaded modules
    modules = dict()
    for module in files:
        name = module.replace(prefix, '').replace(suffix, '')
        spec = importlib.util.spec_from_file_location(
            name,
            os.path.join(path, module)
        )
        modules[name] = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(modules[name])
    return modules
