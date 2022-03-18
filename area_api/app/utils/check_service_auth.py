class NotLoggedInToService(Exception):
    pass


def check_user_logged_to_service(user: dict, token_to_check: str) -> None:
    """
    Verify a user dictionary contains a connection token for a service.
    Raises an error if user is not logged in.
    ## Params
    - user: dictionary representing the user from the database
    - token_to_check: name of the key containing the token in the dict `user`

    ## Raises
    - NotLoggedInToService
    """
    try:
        assert user is not None
        assert user[token_to_check] is not None
        assert user[token_to_check] != ""
    except (KeyError, AssertionError):
        raise NotLoggedInToService(
            "User not logged in to service or user does not exist"
        )
