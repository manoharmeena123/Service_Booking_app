const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const constants = require('../constants/constant');

const authenticate = async (req, res, next) => {
    // console.log('req', req.cookies)
    const token = req?.cookies?.token || req.headers.authorization
    console.log('token', token)
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Token missing' });
    }
    try {
        const decodedToken = jwt.verify(token, 'masai');
        console.log('decodedToken', decodedToken)

        const user = await userModel.findById(decodedToken.userId);

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized - User not found' });
        }
        req.user = {
            userId: user._id,
        };
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

module.exports = authenticate;
