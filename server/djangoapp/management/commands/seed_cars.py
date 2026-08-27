from django.core.management.base import BaseCommand
from djangoapp.models import CarMake, CarModel

SEED = {
    "Toyota": ("Reliable Japanese manufacturer.", [
        ("Camry", "Sedan", 2023), ("RAV4", "SUV", 2022), ("Corolla", "Sedan", 2024),
    ]),
    "Honda": ("Trusted Japanese automaker.", [
        ("Civic", "Sedan", 2021), ("CR-V", "SUV", 2023),
    ]),
    "Ford": ("American automotive pioneer.", [
        ("Mustang", "Coupe", 2023), ("F-150", "Truck", 2022), ("Explorer", "SUV", 2024),
    ]),
    "Chevrolet": ("American manufacturer with a wide lineup.", [
        ("Silverado", "Truck", 2020), ("Malibu", "Sedan", 2022),
    ]),
    "Tesla": ("Electric vehicle innovator.", [
        ("Model 3", "Sedan", 2023), ("Model Y", "SUV", 2024),
    ]),
}


class Command(BaseCommand):
    help = "Seed CarMake and CarModel records for the demo dealership app."

    def handle(self, *args, **options):
        for make_name, (description, models) in SEED.items():
            make, _ = CarMake.objects.get_or_create(name=make_name, defaults={"description": description})
            for model_name, car_type, year in models:
                CarModel.objects.get_or_create(
                    car_make=make, name=model_name,
                    defaults={"type": car_type, "year": year},
                )
        self.stdout.write(self.style.SUCCESS("Seeded car makes and models."))
