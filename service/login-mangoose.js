const Customer = require('../schema/customer-model'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const services = {};

services.login = async (email, password) => {
    const user = await Customer.findOne({ email });

    if (!user) {
        return ({ result: "fail", msg: 'Authentication failed. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return ({ result: "fail", msg: 'Authentication failed. Wrong password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role }, // Include role in the payload
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' } // Token expiration time
    );

    return { result: "success", msg: "User successfully logged in.", token };
}

module.exports = services;
