const express = require('express');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Import routes and middleware
const { userRoutes, authRouter, userProfileRouter } = require('./routes/index');
const { connection } = require('./confige/confige');
const authenticate = require("./middleware/authenticate");
const errorHandler = require("./middleware/errorHandling");

// Landing page and unauthenticated routes
app.get('/', (req, res) => {
    res.status(200).json("Welcome to the E-Commerce App");
});
app.use('/auth', userRoutes);
app.use('/auth', authRouter);

// Authentication middleware applied here
app.use(authenticate);

// Authenticated routes
app.use('/profile', userProfileRouter);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(process.env.PORT, async () => {
    try {
        await connection; // Ensure database connection
        console.log('Database connected successfully');
    } catch (error) {
        console.error(`Error connecting to the database: ${error.message}`);
        process.exit(1);
    }
    console.log(`Server is running on port ${process.env.PORT}`);
});
