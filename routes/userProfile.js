const express = require('express')
const { updateUser,getUserData } = require("../controllers/userProfileController")

const userProfileRouter = express.Router()
const cookieParser = require('cookie-parser');
userProfileRouter.use(cookieParser());
userProfileRouter.post('/updateUser', updateUser);
userProfileRouter.get('/getUserData', getUserData);
module.exports = { userProfileRouter }