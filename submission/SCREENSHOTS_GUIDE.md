# Screenshot guide

Save every file into `submission/screenshots/` using the exact filenames below (`.png` or `.jpeg`).

## Local app (already running)

- Django + React: **http://localhost:8000/**
- Django admin: **http://localhost:8000/admin/**
- Admin login: `admin` / `CapstoneAdmin!2026`
- Demo customer login (already registered): `johndriver` / `DriveSafe#2026`
- Kansas dealer (has reviews, use for detail/review screenshots): dealer id **7**, "Wichita Premier Auto Group"

### Task 12 — `admin_login`
1. Go to http://localhost:8000/admin/
2. Log in with `admin` / `CapstoneAdmin!2026`.
3. Screenshot the resulting admin dashboard (shows "Site administration", "Welcome, admin").

### Task 13 — `admin_logout`
1. From the admin dashboard, click **Log out** (top right).
2. Screenshot the "Logged out" confirmation page.

### Task 17 — `get_dealers`
1. Open a **fresh/incognito** window (so you're logged out) → http://localhost:8000/
2. Screenshot the dealer list home page.

### Task 18 — `get_dealers_loggedin`
1. In your normal browser window, go to http://localhost:8000/login
2. Log in with `johndriver` / `DriveSafe#2026`.
3. On the resulting home page, make sure the browser address bar (showing `localhost:8000/...`), the "Welcome, johndriver" text, and a **Review Dealer** link/button are all visible.
4. Screenshot.

### Task 19 — `dealersbystate`
1. While logged in, use the state filter dropdown and pick **Kansas**.
2. Confirm the address bar changes to something like `localhost:8000/dealers/state/Kansas`.
3. Screenshot with the URL bar visible.

### Task 20 — `dealer_id_reviews`
1. Click into the Kansas dealer ("Wichita Premier Auto Group", id 7) or go directly to http://localhost:8000/dealer/7
2. Screenshot the dealer detail page with its reviews list visible, address bar showing `/dealer/7`.

### Task 21 — `dealership_review_submission`
1. Click **Post Review** (or go to http://localhost:8000/postreview/7).
2. Fill in the review form (text, purchase checkbox, date, car make/model/year) but **don't submit yet**.
3. Screenshot the filled-in form.

### Task 22 — `added_review`
1. Submit the form from the previous step.
2. You should land back on the dealer detail page — screenshot showing your new review in the list (with its sentiment badge).

## Deployed app (IBM Cloud Code Engine)

- URL: **https://dealership-web.2e1j5jfuqybj.eu-de.codeengine.appdomain.cloud/**
- A cloud test user already exists: `cloudtester` / `CloudTest#2026` (or register a fresh one via **Sign Up**)
- Admin also works here: http://.../admin/ with the same `admin` / `CapstoneAdmin!2026` (note: cloud admin data resets on redeploy, but is currently live)
- Dealer 7 (Kansas) already has a review posted from verification testing — feel free to add your own too.

### Task 25 — `deployed_landingpage`
Open the deployment URL (logged out) → screenshot the dealer list landing page.

### Task 26 — `deployed_loggedin`
Log in as `cloudtester` (or register) → screenshot the home page with the username clearly visible.

### Task 27 — `deployed_dealer_detail`
Go to `.../dealer/7` → screenshot the dealer detail + reviews page.

### Task 28 — `deployed_add_review`
Post a review (or view the existing "Cloud Tester" review) on `.../dealer/7` → screenshot the review displayed.

---

**Tip:** the app may take a few seconds to respond on the very first request after being idle (cold start) — reload once if a page looks empty.
