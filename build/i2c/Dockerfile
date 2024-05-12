FROM python:3.12.3-alpine

# Set timezone
ENV TZ=Europe/Paris
RUN apk add --no-cache tzdata

WORKDIR /app
COPY I2C-receiver/requirements.txt .
RUN pip install -r requirements.txt

WORKDIR /
COPY I2C-receiver app
WORKDIR /app

CMD ["python3", "app.py"]