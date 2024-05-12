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
const { updateUser } = require("./controllers/userController")
const authenticate = require("./middleware/authenticate");
const errorHandler = require("./middleware/errorHandling")
//==========================Routes============================================>

// Landing page without authentication
app.get('/', (req, res) => {
    res.status(200).json("Welcome on E-Commerce App");
});
// Unauthenticated routes
app.use('/auth', userRoutes);
app.use('/auth', authRouter)
// Only authenticated users can access routes below this middleware
app.use(authenticate);

// Add other authenticated routes here, e.g., updating user profile
app.use('/profile', userProfileRouter);


// Use the error handling middleware after all routes and other middleware
app.use(errorHandler);
// ======================Start the server======================================>
app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log('Database connected successfully');
    } catch (error) {
        console.error(`Error connecting to the database: ${error.message}`);
        process.exit(1);
    }
    console.log(`Server is running on ${process.env.PORT}`);
});
