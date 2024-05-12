const bcrypt = require('bcrypt');
const userModel = require('../models/userModel'); // Adjust the path as necessary

// Middleware to authenticate token, assumed to be required here or will be passed from app.js
const updateUser = async (req, res) => {
    
    const { email, password, mobileNumber } = req.body;
    const userId = req?.user?.userId;
    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields
        user.email = email || user.email;
        user.mobileNumber = mobileNumber || user.mobileNumber;

        // Handle password change
        if (password) {
            const hash = await bcrypt.hash(password, 5);
            user.password = hash;
        }

        await user.save();

        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getUserData = async (req, res) => {
    const userId = req.user.userId;
    const user = await userModel.findById(userId)

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User data retrieved successfully", user });
};

module.exports = {
    updateUser,
    getUserData
};
