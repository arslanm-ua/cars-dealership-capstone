import json
import logging
import os

import requests
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import CarModel

logger = logging.getLogger(__name__)

NODE_URL = os.environ.get("NODE_URL", "http://localhost:3030/").rstrip("/")


def _node_get(path):
    try:
        resp = requests.get(f"{NODE_URL}{path}", timeout=5)
        return resp.json(), resp.status_code
    except requests.RequestException as exc:
        logger.error("Node service error on GET %s: %s", path, exc)
        return {"status": 500, "message": "Dealership service unavailable"}, 500


def _node_post(path, payload):
    try:
        resp = requests.post(f"{NODE_URL}{path}", json=payload, timeout=5)
        return resp.json(), resp.status_code
    except requests.RequestException as exc:
        logger.error("Node service error on POST %s: %s", path, exc)
        return {"status": 500, "message": "Dealership service unavailable"}, 500


@csrf_exempt
def login_user(request):
    data = json.loads(request.body or "{}")
    username = data.get("userName")
    password = data.get("password")
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({"userName": username, "status": "Authenticated"})
    return JsonResponse({"userName": username, "status": "Failed"})


def logout_request(request):
    logout(request)
    return JsonResponse({"userName": ""})


@csrf_exempt
def registration(request):
    data = json.loads(request.body or "{}")
    username = data.get("userName")
    password = data.get("password")
    first_name = data.get("firstName", "")
    last_name = data.get("lastName", "")
    email = data.get("email", "")

    if User.objects.filter(username=username).exists():
        return JsonResponse({"userName": username, "error": "Username already exists", "status": "Failed"})

    user = User.objects.create_user(
        username=username, first_name=first_name, last_name=last_name,
        password=password, email=email,
    )
    login(request, user)
    return JsonResponse({"userName": username, "status": "Authenticated"})


def get_cars(request):
    car_models = CarModel.objects.select_related("car_make").all()
    cars = [
        {
            "CarMake": cm.car_make.name,
            "CarModel": cm.name,
            "Type": cm.type,
            "Year": cm.year,
        }
        for cm in car_models
    ]
    return JsonResponse({"status": 200, "CarModels": cars})


def get_dealerships(request, state=None):
    path = "/fetchDealers" if not state else f"/fetchDealers/state/{state}"
    data, status = _node_get(path)
    dealers = data.get("data", [])
    return JsonResponse({"status": status, "dealers": dealers})


def get_dealer_details(request, dealer_id):
    data, status = _node_get(f"/fetchDealer/{dealer_id}")
    return JsonResponse({"status": status, "dealer": data.get("data")})


def get_dealer_reviews(request, dealer_id):
    data, status = _node_get(f"/fetchReviews/dealer/{dealer_id}")
    return JsonResponse({"status": status, "reviews": data.get("data", [])})


@csrf_exempt
def add_review(request):
    if not request.user.is_authenticated:
        return JsonResponse({"status": 403, "message": "Unauthorized"}, status=403)
    payload = json.loads(request.body or "{}")
    data, status = _node_post("/insert_review", payload)
    return JsonResponse({"status": status, "review": data.get("data")})


def react_index(request, *args, **kwargs):
    index_path = settings.REACT_INDEX_HTML
    if index_path.exists():
        return HttpResponse(index_path.read_text(), content_type="text/html")
    return HttpResponse(
        "<h1>React build not found</h1><p>Run npm run build in server/frontend.</p>",
        status=501,
    )
