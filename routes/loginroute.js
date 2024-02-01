
const loginmodel = require('../model/login')
const app = require('express').Router()

app.post('/login', async (request, response) => {
    const { username, password } = request.body;

    try {
        const user = await loginModel.findOne({ username, password });

        if (user) {
            // Successful login
            response.status(200).json({ message: "Login successful" });
        } else {
            // Invalid credentials
            response.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Internal server error" });
    }
});

module.exports = app
