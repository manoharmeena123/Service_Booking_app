const express = require('express');
const cookieParser = require('cookie-parser');
require("dotenv").config()
const app = express();
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const {userRoutes} = require('./routes/index')
const {connection} = require('./confige/confige')
const authenticate = require("./middleware/authenticate")



//==========================Routes============================================>

app.use('/', userRoutes);
app.use(authenticate)

app.get('/',(req,res)=>{
res.status(200).json("Welcome on E-Commerce App")
})

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
