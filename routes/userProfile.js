const express = require('express')
const { updateUser,getUserData } = require("../controllers/userProfileController")

const userProfileRouter = express.Router()
const cookieParser = require('cookie-parser');
userProfileRouter.use(cookieParser());
userProfileRouter.patch('/update-user', updateUser);
userProfileRouter.get('/get-profile', getUserData);
module.exports = { userProfileRouter }