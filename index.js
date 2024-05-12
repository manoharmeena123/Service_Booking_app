const express = require('express');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Import routes and middleware
const { userRoutes,authRouter } = require('./routes/index');
const { connection } = require('./confige/confige');
const { updateUser } = require("./controllers/userController")
const authenticate = require("./middleware/authenticate");

//==========================Routes============================================>

// Landing page without authentication
app.get('/', (req, res) => {
    res.status(200).json("Welcome on E-Commerce App");
});
// Unauthenticated routes
app.use('/', userRoutes);
app.use('/',authRouter)
// Only authenticated users can access routes below this middleware
app.use(authenticate);

// Add other authenticated routes here, e.g., updating user profile
userRoutes.patch('/auth/update', authenticate, updateUser); // Apply middleware directly to sensitive route


// Global error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

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
