# Financial Health Check Calculator Backend

## Overview
The Financial Health Check Calculator backend is a Node.js application designed to provide an API for managing user authentication, submitting financial data, and calculating financial scores. This project includes endpoints for user registration, login, and financial data submission, and integrates with MongoDB Atlas for database operations.

## Features
- **User Authentication:** Secure user registration and login with JWT authentication.
- **Financial Data Submission:** Allows users to submit financial data and generates PDF reports.
- **Financial Score Calculation:** Calculates financial scores based on user-submitted data.

## Prerequisites
- Node.js (version 14 or above)
- MongoDB Atlas account
- Postman (optional for testing API endpoints)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/financial-health-check-calculator.git
   cd financial-health-check-calculator/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up a `.env` file with the following environment variables:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/financialhealthcheck?retryWrites=true&w=majority
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   ```

## Running the Application
1. Start the server:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:5000`.

2. Run tests (Jest):
   ```bash
   npm test
   ```

## Endpoints
### Authentication
#### POST `/api/auth/register`
**Description:** Register a new user.

**Request Body:**
```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "password123"
}
```

**Response:**
- **201 Created** (successful registration)
- **400 Bad Request** (validation errors)

#### POST `/api/auth/login`
**Description:** Log in an existing user.

**Request Body:**
```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```

**Response:**
- **200 OK** (successful login with JWT token)
- **401 Unauthorized** (invalid credentials)

### Financial Data
#### POST `/api/submit`
**Description:** Submit financial data and generate a PDF report.

**Headers:**
```json
{
  "Authorization": "Bearer <JWT Token>"
}
```

**Request Body:**
```json
{
  "totalAssets": 100000,
  "totalLiabilities": 50000,
  "totalMonthlyDebtPayments": 2000,
  "grossMonthlyIncome": 8000,
  "annualSavings": 24000,
  "grossIncome": 96000,
  "savings": 30000,
  "monthlyExpenses": 3000,
  "currentRetirementSavings": 50000,
  "targetRetirementSavings": 100000,
  "passiveIncome": 1000,
  "essentials": 50,
  "discretionary": 30,
  "savingsAllocation": 20,
  "creditHealth": 750
}
```

**Response:**
- **200 OK** (PDF report generated)
- **400 Bad Request** (validation errors)
- **401 Unauthorized** (missing or invalid JWT token)

## Testing
### Automated Tests
Run the Jest test suite:
```bash
npm test
```

- **authRoutes.test.js:** Tests user registration and login functionality.
- **submitRoutes.test.js:** Tests financial data submission and PDF generation.
- **financialCalculations.test.js:** Tests the financial score calculation utility.

### Manual Tests (Postman)
#### Authentication
1. **Register a User:**
   - Method: POST
   - URL: `/api/auth/register`
   - Body:
     ```json
     {
       "name": "Test User",
       "email": "testuser@example.com",
       "password": "password123"
     }
     ```
   - Expected Response: 201 Created

2. **Log in a User:**
   - Method: POST
   - URL: `/api/auth/login`
   - Body:
     ```json
     {
       "email": "testuser@example.com",
       "password": "password123"
     }
     ```
   - Expected Response: 200 OK with JWT token

#### Financial Data Submission
1. **Submit Financial Data:**
   - Method: POST
   - URL: `/api/submit`
   - Headers:
     ```json
     {
       "Authorization": "Bearer <JWT Token>"
     }
     ```
   - Body:
     ```json
     {
       "totalAssets": 100000,
       "totalLiabilities": 50000,
       "totalMonthlyDebtPayments": 2000,
       "grossMonthlyIncome": 8000,
       "annualSavings": 24000,
       "grossIncome": 96000,
       "savings": 30000,
       "monthlyExpenses": 3000,
       "currentRetirementSavings": 50000,
       "targetRetirementSavings": 100000,
       "passiveIncome": 1000,
       "essentials": 50,
       "discretionary": 30,
       "savingsAllocation": 20,
       "creditHealth": 750
     }
     ```
   - Expected Response: 200 OK with a downloadable PDF file

## Known Issues
- None at this time. All tests have passed, and manual testing verified endpoint functionality.

## Contribution
1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes and open a pull request.

## License
This project is licensed under the MIT License.

---
**Happy Coding!**


