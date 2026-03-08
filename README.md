# Car Stock Market — Backend

REST API for a car marketplace. Built with **Express 5**, **Sequelize**, and **PostgreSQL**. Handles authentication, car brand/model lookups, and car listings with photo uploads.

---

## Tech Stack

| Layer | Package |
|---|---|
| Framework | Express 5 |
| ORM | Sequelize 6 |
| Database | PostgreSQL (`pg`) |
| Auth | JWT (`jsonwebtoken`) + HTTP-only cookies |
| Password hashing | bcrypt |
| File uploads | Multer |
| Runtime | Node.js (ESM) |

---

## Project Structure

```
├── controllers/
│   ├── Car/
│   │   └── brandController.js      # Get brands & models
│   ├── CarListing/
│   │   └── CarListingController.js # Create & list car listings
│   └── User/
│       └── userController.js       # Register, login, logout, me
├── errors/
│   ├── AppErrors.js                # Base AppError class
│   └── UserErrors.js               # User-specific errors
├── middlewares/
│   ├── AuthMiddleware.js           # JWT cookie auth guard
│   ├── ErrorHandler.js             # Global error handler
│   └── MulterUpload.js             # Disk storage config for photos
├── models/
│   ├── Brand.js
│   ├── CarListing.js
│   ├── CarModel.js
│   ├── CarSpecifications.js
│   ├── User.js
│   ├── const.js                    # Enums (fuel types, vehicle shapes)
│   └── index.js                    # Sequelize instance & associations
├── routes/
│   ├── carRoutes.js                # /api/cars
│   ├── listingRoutes.js            # /api/listings
│   └── userRoutes.js               # /api/users
├── seeders/
│   └── seedBrandsAndModels.js      # Populates Brands & CarModels tables
├── uploads/                        # Uploaded listing photos (gitignored)
└── index.js                        # Entry point
```

---

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DB_NAME=carStockMarket
DB_USER=postgres
DB_PASS=yourpassword
DB_HOST=localhost
PORT=5000
JWT_SECRET=your_jwt_secret
```

### 3. Create the database

Make sure PostgreSQL is running, then create the database:

```bash
psql -U postgres -c "CREATE DATABASE \"carStockMarket\";"
```

### 4. Start the server

The server runs `sequelize.sync({ alter: true })` on startup, so all tables are created/updated automatically.

```bash
# Development (with auto-restart)
pnpm dev

# Production
pnpm start
```

---

## Seeding Brands and Car Models

The seeder fetches a large car make/model dataset from [back4app](https://www.back4app.com/database/back4app/car-make-model-dataset) and populates the `Brands` and `CarModels` tables.

### 1. Get API credentials

Go to [back4app Car Make/Model Dataset](https://www.back4app.com/database/back4app/car-make-model-dataset), create a free account, and copy your:
- `X-Parse-Application-Id`
- `X-Parse-Master-Key`

### 2. Add credentials to the seeder

Open `seeders/seedBrandsAndModels.js` and update the `HEADERS` constant:

```js
const HEADERS = {
  'X-Parse-Application-Id': 'YOUR_APPLICATION_ID',
  'X-Parse-Master-Key': 'YOUR_MASTER_KEY',
  'Accept': 'application/json',
};
```

### 3. Run the seeder

The server must be running first (so the DB tables exist), then in a separate terminal:

```bash
node ./seeders/seedBrandsAndModels.js
```

The seeder paginates through the API in batches of 1000, deduplicates makes and models, and bulk-inserts everything. It will log progress and a final summary:

```
Fetched 1000 rows at skip=0
Fetched 1000 rows at skip=1000
...
Seeded 72 brands and 3891 models.
```

> Running the seeder more than once is safe — it uses `ignoreDuplicates: true`.

---

## API Reference

All protected routes require a valid `token` cookie (set automatically on login/register).

### Auth — `/api/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/users/register` | No | Register a new user |
| `POST` | `/api/users/login` | No | Login and receive a cookie |
| `GET` | `/api/users/me` | Yes | Get the current logged-in user |
| `POST` | `/api/users/logout` | Yes | Clear the auth cookie |

**Register / Login body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "telephone": "+1234567890",
  "password": "secret"
}
```

---

### Cars — `/api/cars` (protected)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/cars/brands` | Get all car brand names |
| `GET` | `/api/cars/brandModels?brand=Toyota` | Get models for a given brand |

---

### Listings — `/api/listings` (protected)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/listings/carListing` | Create a new car listing (multipart/form-data) |
| `GET` | `/api/listings/carListings?page=1` | Get paginated listings (10 per page) |

**Create listing fields** (`multipart/form-data`):

| Field | Type | Required | Notes |
|---|---|---|---|
| `photos` | File(s) | Yes | Up to 10 images |
| `price` | number | Yes | 100 – 5,000,000 |
| `kilowatts` | number | Yes | Engine power in kW |
| `fuelType` | string | Yes | `diesel`, `petrol`, `electric`, `hybrid` |
| `brandModel` | string | Yes | Exact model name (must exist in DB) |
| `mileage` | number | No | Max 2,000,000 |
| `registrationYear` | number | No | 1886 – current year + 1 |
| `registrationMonth` | number | No | 1 – 12 |
| `userId` | number | Yes | Owning user's ID |
| `vehicleShape` | string | Yes | `sedan`, `hatchback`, `suv`, `coupe`, `convertible`, `wagon`, `van`, `truck` |
| `color` | string | No | |
| `numOfDoors` | number | No | 1 – 9 |
| `numOfSeats` | number | No | 1 – 10 |
| `fuelConsumption` | number | Yes | L/100km |
| `motorVolumeFrom` | number | Yes | Engine displacement (cc) |
| `motorVolumeTo` | number | Yes | Engine displacement (cc) |
| `vinNumber` | string | Yes | Unique VIN |
| `numberOfOwners` | number | Yes | 0 – 20 |
| `techincalValidity` | date | No | Technical inspection expiry |

---

## Data Models

### User
`id`, `firstName`, `lastName`, `email` (unique), `telephone`, `password` (bcrypt hashed)

### Brand
`id`, `name` (unique)

### CarModel
`id`, `name`, `brandId` → Brand

### CarListing
`id`, `price`, `kilowatts`, `horsepower` (virtual, computed from kW), `fuel`, `mileage`, `registrationYear`, `registrationMonth`, `photos` (array of paths), `userId` → User, `carModelId` → CarModel

### CarSpecifications
`id`, `vehicleShape`, `color`, `numOfDoors`, `numOfSeats`, `fuelConsumption`, `motorVolumeFrom`, `motorVolumeTo`, `vinNumber`, `numOfOwners`, `techincalValidity`, `carListingId` → CarListing (1-to-1)

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start with nodemon (auto-restart on change) |
| `pnpm start` | Start in production mode |
| `pnpm format` | Format all files with Prettier |
