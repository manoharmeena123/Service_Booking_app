const express = require('express')
const { userSignIn, userLoginIn } = require("../controllers/userController")

const userRoutes = express.Router()
const cookieParser = require('cookie-parser');
userRoutes.use(cookieParser());
userRoutes.post("/auth/sign", userSignIn);
userRoutes.post("/auth/login", userLoginIn);

 module.exports ={
    userRoutes
 }