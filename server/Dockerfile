# Stage 1: build the React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
ENV DISABLE_ESLINT_PLUGIN=true
RUN npm run build

# Stage 2: Django app
FROM python:3.11-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY --from=frontend-build /frontend/build ./frontend/build

ENV DJANGO_DEBUG=False
ENV PYTHONUNBUFFERED=1

RUN python manage.py collectstatic --noinput
RUN chmod +x entrypoint.sh

EXPOSE 8080
CMD ["./entrypoint.sh"]
