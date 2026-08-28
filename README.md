# Cars Dealership — Full-Stack Capstone Project

**Repository name:** cars-dealership-capstone
**Project name:** Cars Dealership — Full-Stack Capstone Project

A responsive web application for **Cars Dealership**, a national car retailer in the U.S. Visitors can
browse dealership branches across the country, filter them by state, view dealer details and reviews
(with automatic sentiment analysis), register/log in, and submit their own dealer reviews.

## Architecture

This project is composed of four independently deployable services:

| Service | Tech | Responsibility |
|---|---|---|
| `server/` | Django 4.2 | Backend API, auth, session/admin, serves the built React app + static pages |
| `server/frontend/` | React 18 (CRA) + React Router | Single-page frontend (dealers, dealer detail, reviews, login/register) |
| `server/database/` | Node.js/Express + MongoDB | Dealership & review data store, exposed as a REST microservice |
| `sentiment_analyzer/` | Flask | Lexicon-based sentiment analysis microservice (`/analyze/<text>`) |

```
Browser
  │
  ▼
Django (server/)  ──HTTP──▶  Node/Express + MongoDB (server/database/)
  │        ▲                        │
  │        │                        ▼
  │        └───HTTP────  Flask sentiment analyzer (sentiment_analyzer/)
  ▼
React build (server/frontend/build) + static pages (About.html, Contact.html)
```

Django exposes a small JSON API under `/djangoapp/...` that the React app calls. Internally, Django
forwards dealer/review requests to the Node microservice, which in turn calls the Flask sentiment
service to classify each review as `positive`, `negative`, or `neutral`.

## Local development

Prerequisites: Python 3.9+, Node 18+, Docker (for MongoDB).

```bash
# 1. MongoDB
docker run -d --name capstone-mongo -p 27017:27017 mongo:6

# 2. Dealership microservice (port 3030)
cd server/database
npm install
node seed.js
node app.js

# 3. Sentiment analyzer (port 5050)
cd sentiment_analyzer
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python app.py

# 4. React frontend build (served by Django as static files)
cd server/frontend
npm install
npm run build

# 5. Django (port 8000)
cd server
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_cars
python manage.py collectstatic --noinput
python manage.py runserver 0.0.0.0:8000
```

Visit `http://localhost:8000/` for the app, `http://localhost:8000/admin/` for the Django admin,
`http://localhost:8000/static/About.html` / `/static/Contact.html` for the static pages.

## Environment variables (Django)

| Variable | Default | Purpose |
|---|---|---|
| `NODE_URL` | `http://localhost:3030/` | Base URL of the dealership microservice |
| `DJANGO_SECRET_KEY` | dev key | Django secret key |
| `DJANGO_DEBUG` | `True` | Debug mode toggle |
| `CSRF_TRUSTED_ORIGINS` | empty | Comma-separated trusted origins for deployment |

## CI/CD

`.github/workflows/django-tests.yml` runs on every push: installs dependencies, runs Django's test
suite and a flake8 lint pass against the `server/` app.

## Deployment

All three services are containerized (see each service's `Dockerfile`) and deployed to IBM Cloud Code
Engine. See `submission/deploymentURL` for the live application URL.
