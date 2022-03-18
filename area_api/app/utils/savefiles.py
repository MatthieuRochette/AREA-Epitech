import os


def savestate(data, files):
    path = "app/datas_file/" + files
    if os.path.exists(path) is True:
        os.remove(path)
    with open(path, "a") as f:
        for col in data:
            f.write(str(col) + "\n")


def open_file(files):
    path = "app/datas_file/" + files
    if os.path.exists(path) is True:
        with open(path, "r") as f:
            content = f.read().split('\n')
            return(len(content) - 1)
    return 0
