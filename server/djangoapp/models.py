from django.db import models
from django.utils.timezone import now


class CarMake(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class CarModel(models.Model):
    SEDAN = "Sedan"
    SUV = "SUV"
    WAGON = "Wagon"
    TRUCK = "Truck"
    COUPE = "Coupe"
    CAR_TYPES = [
        (SEDAN, "Sedan"),
        (SUV, "SUV"),
        (WAGON, "Wagon"),
        (TRUCK, "Truck"),
        (COUPE, "Coupe"),
    ]

    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name="models")
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=CAR_TYPES, default=SUV)
    year = models.PositiveIntegerField(default=now().year)

    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.year})"
