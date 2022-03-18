FROM python:3.8

WORKDIR /area_api
COPY ./prod.env /area_api/.env
COPY . /area_api
RUN pip3 install -r requirements.txt

EXPOSE 80
CMD ["gunicorn", "-b", "0.0.0.0:80", "-w", "1", "--access-logfile", "-", "run:app"]