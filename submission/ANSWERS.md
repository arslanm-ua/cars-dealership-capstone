# Capstone Submission Answers

## Frage 1 (Task 1) — README URL
Repository: cars-dealership-capstone
Project name: Cars Dealership — Full-Stack Capstone Project

https://github.com/arslanm-ua/cars-dealership-capstone/blob/main/README.md

---

## Frage 2 (Task 2) — django_server
```
$ python manage.py runserver 0.0.0.0:8000

Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
August 27, 2026 - 10:55:05
Django version 4.2.30, using settings 'djangoproj.settings'
Starting development server at http://0.0.0.0:8000/
Quit the server with CONTROL-C.

[27/Aug/2026 10:55:08] "GET /djangoapp/get_dealers/ HTTP/1.1" 200 2502
```

---

## Frage 3 (Task 3) — About.html URL
https://github.com/arslanm-ua/cars-dealership-capstone/blob/main/server/frontend/static/About.html

---

## Frage 4 (Task 4) — Contact.html URL
https://github.com/arslanm-ua/cars-dealership-capstone/blob/main/server/frontend/static/Contact.html

---

## Frage 5 (Task 5) — loginuser
```
$ curl -c cookies.txt -X POST http://localhost:8000/djangoapp/login \
    -H "Content-Type: application/json" \
    -d '{"userName":"johndriver","password":"DriveSafe#2026"}'

{"userName": "johndriver", "status": "Authenticated"}
```

---

## Frage 6 (Task 6) — logoutuser
```
$ curl -b cookies.txt http://localhost:8000/djangoapp/logout

{"userName": ""}
```

---

## Frage 7 (Task 7) — Register.jsx URL
https://github.com/arslanm-ua/cars-dealership-capstone/blob/main/server/frontend/src/components/Register/Register.jsx

---

## Frage 8 (Task 8) — getdealerreviews
```
$ curl http://localhost:3030/fetchReviews/dealer/7

{"status":200,"data":[{"id":4,"name":"Brittany Hale","dealership":7,"review":"Best truck-buying experience I've ever had. Staff went above and beyond to get me the right financing.","purchase":true,"purchase_date":"2025-01-10","car_make":"Chevrolet","car_model":"Silverado","car_year":2020,"sentiment":"positive"},{"id":5,"name":"Wesley Turner","dealership":7,"review":"Very disappointed. Waited three hours for paperwork and the car had scratches they never disclosed.","purchase":true,"purchase_date":"2024-08-05","car_make":"Tesla","car_model":"Model 3","car_year":2023,"sentiment":"negative"},{"id":6,"name":"Priya Nair","dealership":7,"review":"Came in to look at a Camry. The lot was decent, prices were about what I expected, nothing stood out.","purchase":false,"purchase_date":"2025-05-18","car_make":"Toyota","car_model":"Camry","car_year":2022,"sentiment":"neutral"},{"id":16,"name":"John Driver","dealership":7,"review":"Fantastic service, the team in Wichita was fantastic and helpful","purchase":true,"purchase_date":"2026-07-01","car_make":"Toyota","car_model":"Camry","car_year":2023,"sentiment":"positive"}]}
```

---

## Frage 9 (Task 9) — getalldealers
```
$ curl http://localhost:3030/fetchDealers

{"status":200,"data":[{"id":1,"full_name":"Bay Area Motors","short_name":"Bay Area Motors","address":"1420 W San Carlos St","city":"San Jose","state":"California","zip":"95126","lat":37.3382,"long":-121.8863},{"id":2,"full_name":"LA Prestige Auto Group","short_name":"LA Prestige Auto","address":"5800 Wilshire Blvd","city":"Los Angeles","state":"California","zip":"90036","lat":34.0522,"long":-118.2437},{"id":3,"full_name":"Lone Star Auto Plaza","short_name":"Lone Star Auto","address":"9310 Katy Freeway","city":"Houston","state":"Texas","zip":"77024","lat":29.7604,"long":-95.3698},{"id":4,"full_name":"Austin Hills Motors","short_name":"Austin Hills Motors","address":"4200 South Lamar Blvd","city":"Austin","state":"Texas","zip":"78704","lat":30.2672,"long":-97.7431},{"id":5,"full_name":"Empire State Auto Group","short_name":"Empire State Auto","address":"875 Central Ave","city":"Albany","state":"New York","zip":"12206","lat":42.6526,"long":-73.7562},{"id":6,"full_name":"Sunshine Coast Motors","short_name":"Sunshine Coast Motors","address":"6300 International Dr","city":"Orlando","state":"Florida","zip":"32819","lat":28.5383,"long":-81.3792},{"id":7,"full_name":"Wichita Premier Auto Group","short_name":"Wichita Premier Auto","address":"2900 N Ridge Rd","city":"Wichita","state":"Kansas","zip":"67205","lat":37.6872,"long":-97.3301},{"id":8,"full_name":"Windy City Auto Mall","short_name":"Windy City Auto Mall","address":"3333 N Elston Ave","city":"Chicago","state":"Illinois","zip":"60618","lat":41.8781,"long":-87.6298},{"id":9,"full_name":"Buckeye Auto Sales","short_name":"Buckeye Auto Sales","address":"4700 Morse Rd","city":"Columbus","state":"Ohio","zip":"43230","lat":39.9612,"long":-82.9988},{"id":10,"full_name":"Peachtree Motors","short_name":"Peachtree Motors","address":"2201 Peachtree Rd NE","city":"Atlanta","state":"Georgia","zip":"30309","lat":33.749,"long":-84.388},{"id":11,"full_name":"Rocky Mountain Auto Group","short_name":"Rocky Mountain Auto","address":"10500 Melody Dr","city":"Denver","state":"Colorado","zip":"80234","lat":39.7392,"long":-104.9903},{"id":12,"full_name":"Evergreen Motors","short_name":"Evergreen Motors","address":"12800 Aurora Ave N","city":"Seattle","state":"Washington","zip":"98133","lat":47.6062,"long":-122.3321}]}
```

---

## Frage 10 (Task 10) — getdealerbyid
```
$ curl http://localhost:3030/fetchDealer/7

{"status":200,"data":{"id":7,"full_name":"Wichita Premier Auto Group","short_name":"Wichita Premier Auto","address":"2900 N Ridge Rd","city":"Wichita","state":"Kansas","zip":"67205","lat":37.6872,"long":-97.3301}}
```

---

## Frage 11 (Task 11) — getdealersbyState (Kansas)
```
$ curl http://localhost:3030/fetchDealers/state/Kansas

{"status":200,"data":[{"id":7,"full_name":"Wichita Premier Auto Group","short_name":"Wichita Premier Auto","address":"2900 N Ridge Rd","city":"Wichita","state":"Kansas","zip":"67205","lat":37.6872,"long":-97.3301}]}
```

---

## Frage 12–13 (Task 12–13) — Screenshots
admin_login.png / admin_logout.png — bereits hochgeladen, unverändert erneut hochladen.

---

## Frage 14 (Task 14+15) — getallcarmakes
```
$ curl http://localhost:8000/djangoapp/get_cars/

{"status": 200, "CarModels": [{"CarMake": "Toyota", "CarModel": "Camry", "Type": "Sedan", "Year": 2023}, {"CarMake": "Toyota", "CarModel": "RAV4", "Type": "SUV", "Year": 2022}, {"CarMake": "Toyota", "CarModel": "Corolla", "Type": "Sedan", "Year": 2024}, {"CarMake": "Honda", "CarModel": "Civic", "Type": "Sedan", "Year": 2021}, {"CarMake": "Honda", "CarModel": "CR-V", "Type": "SUV", "Year": 2023}, {"CarMake": "Ford", "CarModel": "Mustang", "Type": "Coupe", "Year": 2023}, {"CarMake": "Ford", "CarModel": "F-150", "Type": "Truck", "Year": 2022}, {"CarMake": "Ford", "CarModel": "Explorer", "Type": "SUV", "Year": 2024}, {"CarMake": "Chevrolet", "CarModel": "Silverado", "Type": "Truck", "Year": 2020}, {"CarMake": "Chevrolet", "CarModel": "Malibu", "Type": "Sedan", "Year": 2022}, {"CarMake": "Tesla", "CarModel": "Model 3", "Type": "Sedan", "Year": 2023}, {"CarMake": "Tesla", "CarModel": "Model Y", "Type": "SUV", "Year": 2024}]}
```

---

## Frage 15 (Task 16) — analyzereview
```
$ curl http://localhost:5050/analyze/Fantastic%20services

{"score":1.0,"sentiment":"positive","text":"Fantastic services"}
```

---

## Frage 16–21 (Task 17–22) — Screenshots
get_dealers.png / get_dealers_loggedin.png / dealersbystate.png / dealer_id_reviews.png / dealership_review_submission.png / added_review.png — bereits hochgeladen, unverändert erneut hochladen.

---

## Frage 22 (Task 23) — CICD (AKTUALISIERT #2)
```
Python and JavaScript CI (run 33161552237, main branch)

✓ Lint JavaScript Files in 11s
  ✓ Set up job
  ✓ Checkout repository
  ✓ Install Node.js
  ✓ Install JSHint
  ✓ Run JSHint
  ✓ Post Install Node.js
  ✓ Post Checkout repository
  ✓ Complete job

✓ Lint Python Files in 8s
  ✓ Set up job
  ✓ Checkout repository
  ✓ Set up Python
  ✓ Install Pylint
  ✓ Run Pylint
  ✓ Post Set up Python
  ✓ Post Checkout repository
  ✓ Complete job

✓ build-and-test in 11s
  ✓ Set up job
  ✓ Checkout repository
  ✓ Set up Python
  ✓ Install dependencies
  ✓ Run Django test suite
  ✓ Post Set up Python
  ✓ Post Checkout repository
  ✓ Complete job

View run: https://github.com/arslanm-ua/cars-dealership-capstone/actions/runs/33161552237
```

---

## Frage 23 (Task 24) — deploymentURL
```
https://dealership-web.2e1j5jfuqybj.eu-de.codeengine.appdomain.cloud
```

---

## Frage 24–27 (Task 25–28) — Deployment Screenshots
deployed_landingpage.png / deployed_loggedin.png / deployed_dealer_detail.png / deployed_add_review.png — bereits hochgeladen, unverändert erneut hochladen.
