// src/__tests__/authRoutes.test.js

require('dotenv').config(); // Load environment variables

const request = require('supertest');
const app = require('../app'); // Assuming app.js exports the Express app
const mongoose = require('mongoose');
const User = require('../models/User');

// Increase Jest's default timeout

jest.setTimeout(60000); // Sets timeout to 60,000 ms (60 seconds)

describe('Auth Routes Validation', () => {
    beforeAll(async () => {
        // Connect to MongoDB Atlas using the connection string from .env
        await mongoose.connect(process.env.MONGO_URI, {
            // No need for useNewUrlParser and useUnifiedTopology in Mongoose 6+
        });
    });

    afterAll(async () => {
        // Clean up the database and close the connection
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /api/auth/register', () => {
        it('should register a user with valid data', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'testuser@example.com',
                    password: 'password123'
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'testuser@example.com');
        });

        it('should fail registration with missing fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'testuser2@example.com',
                    // Missing name and password
                });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('"name" is a required field');
        });

        it('should fail registration with invalid email', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'invalid-email',
                    password: 'password123'
                });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('"email" must be a valid email');
        });

        it('should fail registration with short password', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'testuser3@example.com',
                    password: '123' // Too short
                });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('"password" should have a minimum length of 6');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeAll(async () => {
            // Create a user to login with
            const user = new User({
                name: 'Login User',
                email: 'loginuser@example.com',
                password: 'password123'
            });
            await user.save();
        });

        it('should login a user with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'loginuser@example.com',
                    password: 'password123'
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'loginuser@example.com');
        });

        it('should fail login with missing fields', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    // Missing email and password
                });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('"email" is a required field');
        });

        it('should fail login with invalid email format', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'invalid-email',
                    password: 'password123'
                });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('"email" must be a valid email');
        });

        it('should fail login with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'loginuser@example.com',
                    password: 'wrongpassword'
                });
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Invalid email or password');
        });

        it('should fail login for non-existent user', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Invalid email or password');
        });
    });
});
