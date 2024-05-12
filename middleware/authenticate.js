const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require("dotenv").config();

const getTokenFromRequest = (req) => {
    if (req.cookies && req.cookies.token) return req.cookies.token;
    if (req.headers.authorization) return req.headers.authorization;
    return null;
}

const authenticate = async (req, res, next) => {
    const token = getTokenFromRequest(req);
    // console.log('Token:', token);

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Token missing' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        // console.log('Decoded Token:', decodedToken);

        const user = await userModel.findById(decodedToken.userId);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized - User not found' });
        }

        req.user = { userId: user._id.toString() };
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

module.exports = authenticate;
