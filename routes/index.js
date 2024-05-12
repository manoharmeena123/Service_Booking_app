const { userRoutes } = require("./userRoutes");
const { authRouter } = require('./authRoutes')
const { userProfileRouter } = require("./userProfile")

module.exports = {
  userRoutes,
  authRouter,
  userProfileRouter
};

