const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require("dotenv").config();

const authenticate = async (req, res, next) => {
    // console.log('req', req.cookies)
    const token = req?.cookies?.token || req.headers.authorization
    console.log('token', token)
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Token missing' });
    }
    try {
        const decodedToken = jwt.verify(token, `${process.env.SECRET_KEY}`);
        console.log('decodedToken', decodedToken)

        const user = await userModel.findById(decodedToken?.userId);
        console.log('user&&&&&&&&&&&', user._id, user._id.toString())

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized - User not found' });
        }
        req.user = {
            userId: user._id.toString(),
        };
        next();
    } catch (error) {
        console.error("error in auth", error);
        res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

module.exports = authenticate;
