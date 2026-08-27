import json
from unittest.mock import patch

from django.contrib.auth.models import User
from django.test import Client, TestCase

from .models import CarMake, CarModel


class CarModelTests(TestCase):
    def test_car_make_and_model_str(self):
        make = CarMake.objects.create(name="Toyota", description="Reliable")
        model = CarModel.objects.create(car_make=make, name="Camry", type=CarModel.SEDAN, year=2023)
        self.assertEqual(str(make), "Toyota")
        self.assertEqual(str(model), "Toyota Camry (2023)")

    def test_get_cars_endpoint(self):
        make = CarMake.objects.create(name="Honda")
        CarModel.objects.create(car_make=make, name="Civic", type=CarModel.SEDAN, year=2022)
        response = self.client.get("/djangoapp/get_cars/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], 200)
        self.assertEqual(data["CarModels"][0]["CarMake"], "Honda")


class AuthFlowTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_register_then_logout(self):
        response = self.client.post(
            "/djangoapp/register",
            data=json.dumps({
                "userName": "testdriver", "password": "TestPass#123",
                "firstName": "Test", "lastName": "Driver", "email": "test@example.com",
            }),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "Authenticated")
        self.assertTrue(User.objects.filter(username="testdriver").exists())

        logout_response = self.client.get("/djangoapp/logout")
        self.assertEqual(logout_response.json(), {"userName": ""})

    def test_login_with_bad_credentials_fails(self):
        User.objects.create_user(username="realuser", password="RealPass#123")
        response = self.client.post(
            "/djangoapp/login",
            data=json.dumps({"userName": "realuser", "password": "wrong"}),
            content_type="application/json",
        )
        self.assertEqual(response.json()["status"], "Failed")

    def test_login_with_good_credentials_succeeds(self):
        User.objects.create_user(username="realuser", password="RealPass#123")
        response = self.client.post(
            "/djangoapp/login",
            data=json.dumps({"userName": "realuser", "password": "RealPass#123"}),
            content_type="application/json",
        )
        self.assertEqual(response.json()["status"], "Authenticated")


class DealershipProxyTests(TestCase):
    @patch("djangoapp.views._node_get")
    def test_get_dealers_proxies_node_service(self, mock_get):
        mock_get.return_value = ({"status": 200, "data": [{"id": 1, "state": "Kansas"}]}, 200)
        response = self.client.get("/djangoapp/get_dealers/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["dealers"][0]["state"], "Kansas")

    def test_add_review_requires_login(self):
        response = self.client.post(
            "/djangoapp/add_review",
            data=json.dumps({"dealership": 1, "review": "Great!"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 403)
