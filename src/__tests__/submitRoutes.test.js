// src/__tests__/submitRoutes.test.js

require('dotenv').config(); // Load environment variables

const request = require('supertest');
const app = require('../app'); // Assuming app.js exports the Express app
const mongoose = require('mongoose');
const User = require('../models/User');
const FinancialData = require('../models/FinancialData');
const jwt = require('jsonwebtoken');

// Increase Jest's default timeout

jest.setTimeout(60000); // Sets timeout to 60,000 ms (60 seconds)


describe('Submit Routes Validation', () => {
    let token;

    beforeAll(async () => {
        // Connect to MongoDB Atlas using the connection string from .env
        await mongoose.connect(process.env.MONGO_URI, {
            // No need for useNewUrlParser and useUnifiedTopology in Mongoose 6+
        });

        // Create a test user and generate a JWT token
        const user = new User({
            name: 'Submit User',
            email: 'submituser@example.com',
            password: 'password123'
        });
        await user.save();

        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
            expiresIn: '1h'
        });
    });

    afterAll(async () => {
        // Clean up the database and close the connection
        await User.deleteMany({});
        await FinancialData.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /api/submit', () => {
        it('should submit financial data with valid inputs', async () => {
            const res = await request(app)
                .post('/api/submit')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    totalAssets: 100000,
                    totalLiabilities: 50000,
                    totalMonthlyDebtPayments: 2000,
                    grossMonthlyIncome: 8000,
                    annualSavings: 24000,
                    grossIncome: 96000,
                    savings: 30000,
                    monthlyExpenses: 3000,
                    currentRetirementSavings: 50000,
                    targetRetirementSavings: 100000,
                    passiveIncome: 1000,
                    essentials: 50,
                    discretionary: 30,
                    savingsAllocation: 20,
                    creditHealth: 750
                });
            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toEqual('application/pdf');
            expect(res.headers['content-disposition']).toContain('attachment;filename=Financial_Report.pdf');
        });

        it('should fail submission with missing fields', async () => {
            const res = await request(app)
                .post('/api/submit')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    // Missing totalAssets and other required fields
                    totalLiabilities: 50000,
                    totalMonthlyDebtPayments: 2000,
                });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('"totalAssets" is a required field');
        });

        it('should fail submission with invalid creditHealth', async () => {
            const res = await request(app)
                .post('/api/submit')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    totalAssets: 100000,
                    totalLiabilities: 50000,
                    totalMonthlyDebtPayments: 2000,
                    grossMonthlyIncome: 8000,
                    annualSavings: 24000,
                    grossIncome: 96000,
                    savings: 30000,
                    monthlyExpenses: 3000,
                    currentRetirementSavings: 50000,
                    targetRetirementSavings: 100000,
                    passiveIncome: 1000,
                    essentials: 50,
                    discretionary: 30,
                    savingsAllocation: 20,
                    creditHealth: 900 // Invalid, assuming max is 850
                });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('"creditHealth" must be less than or equal to 850');
        });

        it('should fail submission without authentication', async () => {
            const res = await request(app)
                .post('/api/submit')
                // No Authorization header
                .send({
                    totalAssets: 100000,
                    totalLiabilities: 50000,
                    totalMonthlyDebtPayments: 2000,
                    grossMonthlyIncome: 8000,
                    annualSavings: 24000,
                    grossIncome: 96000,
                    savings: 30000,
                    monthlyExpenses: 3000,
                    currentRetirementSavings: 50000,
                    targetRetirementSavings: 100000,
                    passiveIncome: 1000,
                    essentials: 50,
                    discretionary: 30,
                    savingsAllocation: 20,
                    creditHealth: 750
                });
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Authorization token missing or malformed');
        });

        it('should fail submission with invalid token', async () => {
            const res = await request(app)
                .post('/api/submit')
                .set('Authorization', `Bearer invalidtoken`)
                .send({
                    totalAssets: 100000,
                    totalLiabilities: 50000,
                    totalMonthlyDebtPayments: 2000,
                    grossMonthlyIncome: 8000,
                    annualSavings: 24000,
                    grossIncome: 96000,
                    savings: 30000,
                    monthlyExpenses: 3000,
                    currentRetirementSavings: 50000,
                    targetRetirementSavings: 100000,
                    passiveIncome: 1000,
                    essentials: 50,
                    discretionary: 30,
                    savingsAllocation: 20,
                    creditHealth: 750
                });
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Invalid or expired token');
        });
    });
});
