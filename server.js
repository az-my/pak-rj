const express = require('express');
const app = express();

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Overtime Management App!');
});

// Export the app
module.exports = app;
