const bcrypt = require('bcrypt');
const express = require('express')
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser")
require("dotenv").config();
const userModel = require('../models/userModel');
const app = express();
app.use(cookieParser())

const userSignIn = async (req, res) => {
    try {
        const { email, password, mobileNumber } = req.body;
        console.log('req.body', req.body)
        const isUserExist = await userModel.findOne({ email });
        if (isUserExist) {
            return res.status(409).json({ message: 'User already exists', isUserExist });
        }

        const hash = await bcrypt.hash(password, 5);
        const user = new userModel({ email, password: hash, mobileNumber });
        await user.save();

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const userLoginIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await userModel.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found, Please Signup first' });
        }

        const hashedPassword = existingUser.password;
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ userId: existingUser._id }, `${process.env.SECRET_KEY}`, { expiresIn: '5h' });
        const refreshToken = jwt.sign({ userId: existingUser._id }, `${process.env.REFRESH_SECRET_KEY}`, { expiresIn: '7d' });

        res.cookie("token", token, { httpOnly: true, maxAge: 1000000 }).cookie("refreshtoken", refreshToken, { httpOnly: true, maxAge: 1000000 })
        // Set cookies or send response as needed
        res.status(200).json({
            message: 'User Login Successful',
            user: {
                existingUser,
                token,
                refreshToken,
            }

        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = { userSignIn, userLoginIn };
