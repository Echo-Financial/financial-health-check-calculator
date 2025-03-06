This file covers project overview, architecture, setup, installation, testing, deployment, API documentation, and guidelines for contributions.

---

```markdown
# Financial Health Check Calculator

A powerful, AI-driven financial health check tool that provides users with personalised financial insights and dynamic marketing emails. This tool calculates key financial scores, generates detailed analysis reports using the OpenAI API, and sends tailored marketing emails via SendGrid.

---

## Table of Contents

- [Overview]
- [Architecture]
- [Environment Setup]
- [Installation]
- [Running the Application]
- [Testing]
- [API Documentation]
- [Code Quality & Contribution Guidelines]
- [CI/CD & Deployment]
- [Security & Data Management]
- [Backup, Recovery & Rollback]
- [Project Roadmap & Changelog]
- [Contact Information]

---

## Overview

The **Financial Health Check Calculator** is designed to help users understand and improve their financial wellbeing. It collects user financial data through a multi-step form, calculates financial scores, and generates personalised analysis and marketing content using GPT (via the OpenAI API). Personalised marketing emails are then sent via SendGrid, providing high‑conversion insights for potential financial advisory clients.

---

## Architecture

### System Components

- **Frontend:**
  - **Framework:** React
  - **State Management:** Formik for multi-step forms
  - **Styling:** SCSS, Material-UI, and custom CSS
  - **Routing:** React Router
  - **Testing:** Jest with React Testing Library

- **Backend:**
  - **Framework:** Node.js with Express
  - **Core Services:**
    - **Financial Calculations:** Compute key financial scores from user input.
    - **GPT Integration:** Uses OpenAI API to generate analysis reports and personalised marketing content.
    - **Email Service:** Sends marketing emails via SendGrid.
  - **Testing:** Jest for unit and integration tests
  - **Deployment:** Hosted on Render

- **External Integrations:**
  - **OpenAI API:** For dynamic analysis and content generation.
  - **SendGrid:** For sending personalized marketing emails.
  - **MongoDB Atlas:** For data storage (if applicable).

### Visual Diagrams

- **Data Flow Diagram:**  
  Illustrates how user input flows from the frontend to the backend, gets processed (calculations and GPT analysis), and finally results in an email sent via SendGrid.
- **Component Interaction Diagram:**  
  A UML diagram or flowchart detailing interactions between frontend components, backend routes, utility modules (e.g., GPT utilities), and external services.

---

## Environment Setup

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn
- Git

### Environment Variables

Sensitive keys are stored in `.env` files. Create these files in your respective directories.

#### Backend `.env` Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

#### Frontend `.env` Example:

```env
REACT_APP_API_URL=http://localhost:5000
```

*Make sure to add your `.env` files to `.gitignore`.*

---

## Installation

### Backend

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Babel Configuration:**

   Create a `babel.config.js` file in your backend root with:

   ```js
   module.exports = {
     presets: ['@babel/preset-env'],
   };
   ```

4. **Jest Configuration:**

   Create a `jest.config.js` file in your backend root:

   ```js
   module.exports = {
     transform: {
       '^.+\\.js$': 'babel-jest',
     },
     transformIgnorePatterns: [
       '/node_modules/(?!(axios|@sendgrid)/)',
     ],
     testEnvironment: 'node',
   };
   ```

### Frontend

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Ensure Babel Configuration:**

   Your `.babelrc` should look like:

   ```json
   {
     "presets": ["@babel/preset-env", "@babel/preset-react"]
   }
   ```

---

## Running the Application

### In Development

#### Backend

- Start the backend server:

  ```bash
  npm run dev
  ```

  The server will run on the port specified in your `.env` file (default: 5000).

#### Frontend

- Start the React app:

  ```bash
  npm start
  ```

  The app will typically run on port 3000.

### Running Tests

#### Backend Tests

- Run tests with Jest:

  ```bash
  npm test
  ```

#### Frontend Tests

- Run tests:

  ```bash
  npm test
  ```

---

## API Documentation

### Endpoints

#### 1. POST /api/submit

- **Description:** Calculates financial scores from user input.
- **Request Body Example:**

  ```json
  {
    "personalDetails": { "age": 30, "annualIncome": 50000, ... },
    "expensesAssets": { "monthlyExpenses": 2000, ... }
  }
  ```

- **Response Example:**

  ```json
  { "scores": { "financialHealthScore": 75, "retirementScore": 80 } }
  ```

#### 2. POST /api/financial-analysis

- **Description:** Generates a detailed financial analysis report using GPT.
- **Request Body:** Contains original user data and calculated metrics.
- **Response Example:**

  ```json
  { "analysis": "Detailed analysis text..." }
  ```

#### 3. POST /api/generate-marketing

- **Description:** Uses GPT to generate personalized marketing email content.
- **Request Body:** Must include `analysisText`, `personalDetails`, and `calculatedMetrics`.
- **Response Example:**

  ```json
  {
    "subject": "Compelling subject line",
    "body": "Dynamic email body content",
    "cta": "Dynamic CTA text"
  }
  ```

#### 4. POST /api/send-marketing-email

- **Description:** Sends a personalized marketing email via SendGrid.
- **Request Body:** Contains marketing email details including recipient, subject, and body.
- **Response Example:**

  ```json
  { "result": "Email sent" }
  ```

---

## Code Quality & Contribution Guidelines

### Style & Standards

- **Linting & Formatting:**  
  Use ESLint and Prettier for consistent code style. Configuration files:
  - **.eslintrc.json:**

    ```json
    {
      "env": {
        "browser": true,
        "node": true,
        "es2021": true
      },
      "extends": ["eslint:recommended", "plugin:react/recommended"],
      "parserOptions": {
        "ecmaFeatures": { "jsx": true },
        "ecmaVersion": 12,
        "sourceType": "module"
      },
      "plugins": ["react"],
      "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "single"]
      }
    }
    ```

  - **.prettierrc:**

    ```json
    {
      "semi": true,
      "singleQuote": true,
      "printWidth": 80
    }
    ```

### Branching & Code Reviews

- **Branching Model:**  
  Use GitFlow or similar:
  - **main/master:** Production-ready code.
  - **develop:** Latest development work.
  - **feature branches:** New features and fixes.
- **Code Reviews:**  
  All changes must be reviewed via pull requests before merging. Follow a checklist (linting, testing, documentation updates).

---

## Continuous Integration & Deployment (CI/CD)

### Automated Testing

- **Unit Tests:**  
  Use Jest (for both frontend and backend) with comprehensive coverage.
- **Integration & End-to-End Tests:**  
  Consider adding Cypress or Selenium for E2E tests.
- **Test Coverage:**  
  Aim for high coverage and integrate coverage reports in CI.

### Pipeline Details

- **GitHub Actions:**  
  Example workflow:
  ```yaml
  name: CI/CD Pipeline
  on:
    push:
      branches: [ main ]
    pull_request:
      branches: [ main ]
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - name: Setup Node.js
          uses: actions/setup-node@v2
          with:
            node-version: '14'
        - name: Install backend dependencies
          run: npm install
          working-directory: ./backend
        - name: Run backend tests
          run: npm test
          working-directory: ./backend
        - name: Build frontend
          run: npm run build
          working-directory: ./frontend
        # Add deployment steps as necessary
  ```
- **Render Pipelines:**  
  Configure build and deployment settings in Render with appropriate environment variables.

---

## Dependency Management & Versioning

### Version Control

- Use `package-lock.json` or `yarn.lock` for reproducible builds.
- Document key versions (e.g., Node.js, React, Express, etc.) in your README.

### Update Process

- Regularly run `npm outdated` and update dependencies.
- Use tools like Renovate or Dependabot for automated updates.
- Always run tests after dependency updates to catch regressions.

---

## Security & Data Management

### API & Data Security

- **Environment Variables:**  
  Store sensitive keys (OPENAI_API_KEY, SENDGRID_API_KEY, JWT_SECRET) in environment variables.
- **Input Validation:**  
  Ensure all API endpoints validate and sanitize input.
- **Authentication:**  
  Use strong JWT secrets and expiration settings.

### Vulnerability Scanning

- Run `npm audit` regularly.
- Integrate Snyk or similar tools for continuous monitoring.

---

## Backup, Recovery & Rollback Strategy

### Deployment Failures

- Maintain version tags and clear commit histories.
- Document steps to rollback to a previous stable version in case of failure.
- Use Render’s deployment logs and snapshots for monitoring.

### Data Backup

- Regularly back up MongoDB Atlas databases.
- Implement strategies for application state backups and recovery.

---

## Project Roadmap & Changelog

### Future Enhancements

- **Scalability Improvements:**  
  - Caching GPT responses.
  - Load balancing and microservices for increased traffic.
- **Enhanced Personalization:**  
  - Further refine GPT prompts.
  - Integrate user feedback loops.

### Changelog

Maintain a `CHANGELOG.md` that records:
- Version numbers and release dates.
- Features added, bugs fixed, and significant changes.

Example:
```markdown
# Changelog

## [1.2.0] - 2025-02-22
### Added
- Dynamic GPT-based marketing email generation.
- Hard-coded CTA button and signature integration.
- Comprehensive frontend and backend test coverage.

### Fixed
- Formatting issues in generated emails.
- Bug in multi-step form data persistence.

## [1.1.0] - 2025-01-15
### Added
- Financial health score calculations.
- Basic email notification functionality via VBOUT.

## [1.0.0] - 2024-12-01
### Initial release
```

---

## Contact Information

For further support or inquiries:

- **Kevin Morgan**  
  Email: [kevin.morgan@echo-financial-advisors.co.nz](mailto:kevin.morgan@echo-financial-advisors.co.nz)  
  Phone: +6421667511

---

## Final Notes

- **Maintenance:**  
  Regularly update dependencies, run security audits, and monitor performance.
- **Scaling:**  
  Consider additional caching, load balancing, and potential microservices architecture as user demand grows.
- **Documentation:**  
  Keep this document updated with any architectural changes or process improvements.

Happy coding!
```

---

You can now copy and paste this README.md into your repository. Once reviewed and finalized, commit it to your repository as part of your phase 4 release.

Let me know if you need further refinements or additional sections!