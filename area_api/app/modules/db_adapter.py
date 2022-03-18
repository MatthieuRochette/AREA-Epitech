from os import getenv

import dotenv
from flask_pymongo import MongoClient

from ..utils import log

FLASK_ENV = getenv("FLASK_ENV")
if FLASK_ENV is None or FLASK_ENV == "development":
    dotenv.load_dotenv(dotenv_path=".env", verbose=True)
MONGO_USERNAME = getenv("MONGO_USERNAME")
MONGO_PASSWORD = getenv("MONGO_PASSWORD")
MONGO_HOST = getenv("MONGO_HOST")
MONGO_PORT = getenv("MONGO_PORT")
MONGO_DATABASE = getenv("MONGO_DATABASE")


class DatabaseAdapterException(Exception):
    pass


class DatabaseAdapter():
    _uri = "mongodb://" + MONGO_USERNAME + ":" + MONGO_PASSWORD +\
        "@" + MONGO_HOST + ":" + MONGO_PORT + "/" + MONGO_DATABASE
    _db_cluster = MongoClient(_uri)

    def __init__(self):
        pass

    def insert_one(self, collection_name, data: dict, db_name=MONGO_DATABASE):
        """
        Insert one element in the database.
        Returns False if there is an error, True otherwise.
        - collection_name: name of the collection where you want to store data
        - data: dictionary containing your data
        - db_name: name of the database to use (defaults to MONGO_DATABASE)
        """
        try:
            db = self._db_cluster[db_name]
            db[collection_name].insert_one(data)
        except Exception as excp:
            log("ERROR", excp)
            log("ERROR", "Could not create one entry in database ",
                db_name + "/" + collection_name)
            return False
        else:
            return True

    def insert_many(self, collection_name, data_list: list,
                    db_name=MONGO_DATABASE):
        """
        Insert multiple elements at once in the database.
        Returns False if there is an error, True otherwise.
        - collection_name: name of the collection where you want to store data
        - data_list: list of dictionaries containing your data
        - db_name: name of the database to use (defaults to MONGO_DATABASE)
        """
        try:
            db = self._db_cluster[db_name]
            db[collection_name].insert_many(data_list)
        except Exception as excp:
            log("ERROR", excp)
            log("ERROR", "Could not insert multiple entries in database ",
                db_name + "/" + collection_name)
            return False
        else:
            return True

    def find(self, collection_name, filters={}, db_name=MONGO_DATABASE):
        """
        Find multiple elements at once in the database.
        Returns a list containing the results of the search (empty means no
        results).
        - collection_name: name of the collection where you want to search
        - filters: dictionary that contains the search filters
            (leave empty to select all)
        - db_name: name of the database to use (defaults to MONGO_DATABASE)
        """
        try:
            db = self._db_cluster[db_name]
            results = db[collection_name].find(filters)
            return list(results)
        except Exception as excp:
            log("ERROR", excp)
            log("ERROR", "Could not search in database ",
                db_name + "/" + collection_name)
            raise DatabaseAdapterException("An exception occured:"
                                           + " see the logs for more details.")

    def find_one(self, collection_name, filters={}, db_name=MONGO_DATABASE):
        """
        Find one element in the database.
        Returns a list containing the results of the search (empty means no
        results).
        - collection_name: name of the collection where you want to search
        - filters: dictionary that contains the search filters
            (leave empty to select all)
        - db_name: name of the database to use (defaults to MONGO_DATABASE)
        """
        try:
            db = self._db_cluster[db_name]
            return db[collection_name].find_one(filters)
        except Exception as excp:
            log("ERROR", excp)
            log("ERROR", "Could not search one entry in database ",
                db_name + "/" + collection_name)
            raise DatabaseAdapterException("An exception occured:"
                                           + " see the logs for more details.")

    def delete_one(self, collection_name, filters: dict,
                   db_name=MONGO_DATABASE):
        """
        Delete one element in the database.
        WARNING: You should this function only when you are sure that your
        filters match only with one entry, otherwise you might delete the wrong
        entry.
        Returns False if there is an error, True otherwise.
        - collection_name: name of the collection where you want to store data
        - filters: dict containing your filters (empty deletes everything)
        - db_name: name of the database to use (defaults to MONGO_DATABASE)
        """
        try:
            db = self._db_cluster[db_name]
            db[collection_name].delete_one(filters)
        except Exception as excp:
            log("ERROR", excp)
            log("ERROR", "Could not remove one entry in database ",
                db_name + "/" + collection_name)
            return False
        else:
            return True

    def delete_many(self, collection_name, filters: dict,
                    db_name=MONGO_DATABASE):
        """
        Delete multiple elements at once in the database.
        Returns False if there is an error, True otherwise.
        - collection_name: name of the collection where you want to store data
        - filters: dict containing your filters (empty deletes everything)
        - db_name: name of the database to use (defaults to MONGO_DATABASE)
        """
        try:
            db = self._db_cluster[db_name]
            db[collection_name].delete_many(filters)
        except Exception as excp:
            log("ERROR", excp)
            log("ERROR", "Could not remove multiple entries in database ",
                db_name + "/" + collection_name)
            return False
        else:
            return True

    def update_one(self, collection_name, filters: dict, new_data: dict,
                   db_name=MONGO_DATABASE):
        """
        Update one element in the database.
        WARNING: You should this function only when you are sure that your
        filters match only with one entry, otherwise you might update the wrong
        entry.
        Returns False if there is an error, True otherwise.
        - collection_name: name of the collection where you want to store data
        - filters: dictionary containing your filters (empty for everything)
        - new_data: dictionary containing the data to update
        - db_name: name of the database to use (defaults to MONGO_DATABASE)
        """
        try:
            db = self._db_cluster[db_name]
            db[collection_name].update_one(filters, new_data)
        except Exception as excp:
            log("ERROR", excp)
            log("ERROR", "Could not update one entry in database ",
                db_name + "/" + collection_name)
            return False
        else:
            return True

    def update_many(self, collection_name, filters: dict, new_data: dict,
                    db_name=MONGO_DATABASE):
        """
        Update multiple elements at once in the database.
        Returns False if there is an error, True otherwise.
        - collection_name: name of the collection where you want to store data
        - filters: dictionary containing your filters (empty for everything)
        - new_data: dictionary containing the data to update
        - db_name: name of the database to use (defaults to MONGO_DATABASE)
        """
        try:
            db = self._db_cluster[db_name]
            db[collection_name].update_many(filters, new_data)
        except Exception as excp:
            log("ERROR", excp)
            log("ERROR", "Could not update many entries in database ",
                db_name + "/" + collection_name)
            return False
        else:
            return True
