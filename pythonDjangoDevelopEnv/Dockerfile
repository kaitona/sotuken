FROM python:3.9.6
ENV PYTHONUUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN apt update && apt install -y sqlite3 vim less
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
