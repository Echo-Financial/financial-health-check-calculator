Here is a complete and polished `README.md` file for the root directory:

```markdown
# Financial Health Check Calculator

**Echo's Financial Health Check Calculator** is a comprehensive tool designed to help individuals assess and improve their financial well-being. The calculator evaluates various financial metrics, provides personalized recommendations, and captures user information for further engagement.

---

## Features
- **Interactive Financial Assessment**: Evaluate key aspects of financial health, including income, expenses, savings, assets, and retirement goals.
- **Personalized Recommendations**: Receive actionable advice tailored to your financial data.
- **Dynamic Visualizations**: View data through intuitive charts and graphs.
- **Lead Generation**: Capture user details for further interaction.
- **PDF Export**: Generate detailed reports for download or sharing.

---

## Technologies Used

### **Frontend**
- React (with Create React App)
- Bootstrap for styling
- Chart.js for data visualizations

### **Backend**
- Netlify Functions for API operations
- Axios for HTTP requests

### **Other Tools**
- jsPDF for generating PDF reports
- Webflow for initial design concepts

---

## Getting Started

Follow the steps below to set up and run the project locally.

### Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

### **Frontend Setup**

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

### **Backend Setup**

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

4. Ensure the frontend is configured to communicate with the backend API at:
   ```
   http://localhost:5000
   ```

---

## Usage

1. **Navigate through the form**: Input your financial details step by step.
2. **View recommendations**: After submitting the form, receive personalized financial insights.
3. **Export your report**: Use the PDF generation feature to download a detailed report.

---

## Testing

To ensure the functionality of the application, run the following commands:

### Run Tests
Navigate to the `frontend` directory and execute:
```bash
npm test
```

### Test Coverage
- Validates form inputs and ensures correct API interactions.
- Covers multi-step form navigation.
- Confirms rendering of visualizations and PDF generation.

---

## Folder Structure

```plaintext
financial-health-check-calculator/
├── frontend/               # React app for the user interface
│   ├── public/             # Static files
│   ├── src/                # Source files for React
│   └── package.json        # Dependencies and scripts for the frontend
├── backend/                # Backend serverless functions
│   ├── functions/          # API endpoints
│   └── package.json        # Dependencies and scripts for the backend
└── README.md               # Project overview (this file)
```

---

## Known Issues

### Deprecation Warnings
- The `punycode` module generates deprecation warnings. These do not affect the current functionality but will be addressed in future updates.

### Additional Notes
- Ensure all form fields are completed before submission.
- If the backend is not running, API calls will fail.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Description of changes"`).
4. Push to the branch (`git push origin feature-name`).
5. Create a Pull Request.

---

## Contact

For support or inquiries:
- **Email**: [support@echo-financial-advisors.co.nz](mailto:support@echo-financial-advisors.co.nz)
- **Website**: [Echo Financial Advisors](https://www.echo-financial-advisors.co.nz)

```

This `README.md` provides a comprehensive overview of your project and serves as a professional entry point for contributors, users, or stakeholders. It consolidates all relevant details and eliminates the need for multiple `README.md` files across the project.