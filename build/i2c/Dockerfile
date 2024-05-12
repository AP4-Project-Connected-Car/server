FROM python:3.12

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends tzdata && apt-get clean

WORKDIR /app
COPY I2C-receiver/requirements.txt .
RUN pip install -r requirements.txt

WORKDIR /
COPY I2C-receiver app
WORKDIR /app

CMD ["python3", "app.py"]