Below is an updated version of my **README.md** file that incorporates our latest understanding, enhancements, and deployment details. This version is designed to give a complete picture of the project—from its technical architecture to its market positioning and future enhancements—so that a new developer or stakeholder can quickly get up to speed.

---

```markdown
# Financial Health Check Calculator

**Echo Financial Health Check Calculator** is a FinTech web application designed to empower individuals and financial advisory businesses by providing a comprehensive, personalized financial assessment. The tool collects user financial data through a streamlined multi-step form, calculates key metrics, and generates actionable recommendations using AI-powered analysis. In addition, the system logs compliance data and captures leads to support both internal use at Echo Financial Advisors and future commercialization.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Testing](#testing)
- [Known Issues](#known-issues)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [Contact](#contact)

---

## Features

- **Interactive Financial Assessment:**  
  Evaluate your financial health through a multi-step form that captures personal details, income sources, expenses, assets, and retirement planning.
  
- **Personalized Recommendations:**  
  Receive tailored advice based on key financial metrics such as debt-to-income, savings rate, emergency funds, retirement readiness, and investment opportunities.
  
- **Dynamic Visualizations:**  
  View engaging charts and gauges that illustrate your financial scores and projections.
  
- **Lead Generation:**  
  Capture user details for follow-up engagement and integrate seamlessly with CRM systems.
  
- **Compliance Logging:**  
  Automatically log generated advice for regulatory compliance, with an admin dashboard for reviewing and acting on flagged recommendations.
  
- **PDF Export:**  
  Generate detailed, downloadable reports of your financial analysis.

---

## Technologies Used

### **Frontend**
- **Framework:** React (with Create React App)
- **UI Libraries:** Material UI, React Bootstrap
- **Form Management:** Formik and Yup for multi-step form handling and validation
- **Data Visualization:** Chart.js and canvas-gauges (via react-chartjs-2)
- **Styling:** SCSS (with a custom brand defined in _brand.scss, _base.scss, _layout.scss, and _components.scss)
- **Routing:** React Router

### **Backend**
- **Runtime:** Node.js with Express
- **Database:** MongoDB Atlas, using Mongoose for data modeling
- **AI Integration:** OpenAI API for generating personalized financial analysis and marketing content
- **Email Service:** SendGrid (with Markdown-to-HTML conversion for email formatting)
- **Logging:** Winston
- **Authentication:** JWT-based authentication

### **DevOps & Testing**
- **Version Control:** Git with GitHub
- **Package Managers:** npm and Yarn
- **Testing:** Jest for unit and integration tests
- **CI/CD:** (Planned) GitHub Actions for automated testing and deployment

---

## Project Structure

```plaintext
financial-health-check-calculator/
├── backend/
│   ├── src/
│   │   ├── controllers/         # API controllers (adminAuthController.js, submitController.js, etc.)
│   │   ├── middleware/          # Express middleware (authMiddleware.js, errorHandler.js)
│   │   ├── models/              # Mongoose models (Admin.js, Review.js, User.js)
│   │   ├── routes/              # API routes (auth.js, financialAnalysis.js, gpt.js, generate-marketing.js, review.js, etc.)
│   │   ├── utils/               # Utility functions (financialCalculations.js, gptUtils.js, openaiClient.js, complianceUtils.js)
│   │   ├── emailService.js      # Email sending via SendGrid (with Markdown-to-HTML conversion)
│   │   ├── logger.js            # Logging configuration (Winston)
│   │   └── index.js             # Entry point for the backend server
│   ├── package.json             # Backend dependencies and scripts
│   └── .env                   # Environment variables (MongoDB URI, JWT secret, SendGrid API key, etc.)
├── frontend/
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Forms/           # Multi-step form components (LeadCaptureForm.jsx, FormField.jsx)
│   │   │   ├── InputSections/   # Form sections (PersonalDetails.jsx, ExpensesAssets.jsx, RetirementPlanning.jsx, CreditHealth.jsx, ContactDetails.jsx)
│   │   │   └── Visualisations/  # Data visualization components (Charts.js, Gauge.js)
│   │   ├── context/             # Authentication context (AuthContext.js)
│   │   ├── pages/               # Page components (Home.js, Report.js, Login.js, Register.js, AdminLogin.js, AdminDashboard.js)
│   │   ├── styles/              # SCSS styles (_brand.scss, _base.scss, _layout.scss, _components.scss, main.scss, adminDashboard.scss)
│   │   ├── theme.js             # Material UI theme configuration
│   │   └── App.js               # Main React application entry point
│   ├── package.json             # Frontend dependencies and scripts
│   └── yarn.lock                # Lock file for Yarn
└── README.md                    # This document
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Access to MongoDB Atlas (for the backend database)
- Access to a hosting platform (Render, Heroku, AWS, or similar)
- Git for version control and GitHub account for repository hosting

### **Frontend Setup**

1. **Navigate to the `frontend` Directory:**
   ```bash
   cd frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   (Alternatively, if you prefer Yarn: `yarn install`)

3. **Start the Development Server:**
   ```bash
   npm start
   ```
   This should launch the application at `http://localhost:3000`.

### **Backend Setup**

1. **Navigate to the `backend` Directory:**
   ```bash
   cd backend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the backend directory with the following variables:
   ```dotenv
   PORT=5000
   MONGO_URI=<Your MongoDB Atlas URI>
   JWT_SECRET=<Your JWT Secret>
   JWT_EXPIRES_IN=3600
   OPENAI_API_KEY=<Your OpenAI API Key>
   SENDGRID_API_KEY=<Your SendGrid API Key>
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=<Your Email Username>
   EMAIL_PASSWORD=<Your Email Password or App Password>
   EMAIL_FROM=<Your From Email Address>
   ```
4. **Start the Backend Server:**
   ```bash
   npm run dev
   ```
   The server should start on `http://localhost:5000` and connect to MongoDB Atlas.

---

## Deployment

### **Frontend Deployment Options:**
- **Embed as an Iframe:**  
  Deploy the Financial Health Check Calculator on a subdomain (e.g., `app.yourdomain.com`) and embed it into your Webflow site using an iframe.
  
- **Dedicated Landing Page:**  
  Build an attractive landing page on Webflow that includes a strong call-to-action (e.g., “Start Your Free Assessment”) linking out to your deployed calculator.

### **Backend Deployment:**
- **Cloud Hosting:**  
  Deploy your backend to a platform like Render, Heroku, or AWS. Configure your environment variables on the host.
  
- **CI/CD Pipeline:**  
  Set up automated testing and deployment (e.g., via GitHub Actions) to ensure smooth updates.

---

## Usage

1. **Complete the Multi-Step Form:**  
   Provide your financial details step by step. Helper texts and tooltips guide you on what each field expects (e.g., annual income in NZD, monthly expenses, total assets including property and investments).

2. **View Your Report:**  
   After submission, the application generates a personalized financial report with visual charts and a detailed analysis, which is displayed on the Report page.

3. **Lead Capture and Follow-Up:**  
   Your contact details are captured, and marketing emails are sent using the integrated SendGrid service. All interactions are logged for compliance.

4. **Admin Dashboard:**  
   Authorized users can log in to the admin dashboard to review compliance records, manage flagged advice, and view lead analytics.

---

## Testing

### **Automated Testing**
- **Backend Tests:**  
  Navigate to the `backend` directory and run:
  ```bash
  npm test
  ```
  This runs Jest tests to verify the accuracy of financial calculations and API endpoints.

- **Frontend Tests:**  
  From the `frontend` directory, run:
  ```bash
  npm test
  ```
  to ensure UI components behave as expected.

### **Manual Testing**
- **Form Submission:**  
  Complete the multi-step form and verify that the report page displays the correct data.
- **Email Notifications:**  
  Test email functionality with Postman or your development workflow.
- **Admin Dashboard:**  
  Ensure reviews are displayed correctly, and action buttons (Approve, Reject, Modify) work as intended.

---

## Known Issues

- **Deprecation Warnings:**  
  The `punycode` module and some Babel dependencies generate warnings. These do not affect functionality but will be addressed in future updates.
- **UI/UX Refinements:**  
  Some form fields might require additional clarification (e.g., specifying annual vs. monthly figures). Future iterations should enhance these details.
- **Responsiveness:**  
  Additional testing may be needed to ensure the design is fully responsive across all devices.

---

## Future Enhancements

- **CRM Integration:**  
  Connect the lead capture form with popular CRM systems for automated follow-up.
- **Advanced Analytics:**  
  Develop an analytics dashboard to track lead conversion and user engagement.
- **Customization Options:**  
  Allow financial advisory firms to white-label the application and customize the branding.
- **Enhanced Security:**  
  Implement multi-factor authentication and advanced role-based access controls as the user base grows.

---

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a Pull Request on GitHub.

---

## Contact

For support or inquiries, please contact:
- **Kevin Morgan** – Founder & Managing Director  
  Email: [kevin.morgan@echo-financial-advisors.co.nz](mailto:kevin.morgan@echo-financial-advisors.co.nz)  
- **Website:** [Echo Financial Advisors](https://www.echo-financial-advisors.co.nz)

---

This README provides a comprehensive overview of the Financial Health Check Calculator, ensuring a smooth handover to any developer or stakeholder involved in the next phase of the project.

```

---

This updated README.md includes detailed instructions, project context, a clear folder structure, and outlines both the current state and planned enhancements to ensure smooth progression into the next phase. Let me know if you need any further adjustments!