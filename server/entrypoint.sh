#!/bin/sh
set -e

python manage.py migrate --noinput

if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  python manage.py shell -c "
from django.contrib.auth.models import User
import os
u = os.environ['DJANGO_SUPERUSER_USERNAME']
p = os.environ['DJANGO_SUPERUSER_PASSWORD']
e = os.environ.get('DJANGO_SUPERUSER_EMAIL', '')
if not User.objects.filter(username=u).exists():
    User.objects.create_superuser(u, e, p)
"
fi

python manage.py seed_cars

exec gunicorn djangoproj.wsgi:application --bind 0.0.0.0:8080 --workers 2
