import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from os import getenv

import dotenv

from app.utils import log

FLASK_ENV = getenv("FLASK_ENV")
if FLASK_ENV is None or FLASK_ENV == "development":
    dotenv.load_dotenv(dotenv_path="secrets.env", verbose=True)
EMAIL_ADDR = getenv("NATIVE_EMAIL_ADDR")
EMAIL_PW = getenv("NATIVE_EMAIL_PW")

server_url = "smtp.gmail.com"
port = 465  # SSL SMTP port for Google


class Emailer():
    def __init__(self):
        self.server = smtplib.SMTP_SSL(host=server_url, port=port)

    def send(self, recv_addr: str, subj: str, txt: str, html: str = None):
        message = MIMEMultipart("alternative")
        message["From"] = EMAIL_ADDR
        message["To"] = recv_addr
        message["Subject"] = subj
        message.attach(MIMEText(txt, "plain"))
        if html is not None:
            message.attach(MIMEText(html, "html"))

        self.server.connect(server_url, port)
        self.server.login(EMAIL_ADDR, EMAIL_PW)
        self.server.sendmail(EMAIL_ADDR, recv_addr, message.as_string())
        log("INFO", "Email to", recv_addr)
        log("DEBUG", "message :", message.as_string())
        self.server.quit()
