const express = require('express');
const app = express();

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Overtime Management App!');
});

// Error handling for unhandled exceptions
process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server
const PORT = process.env.PORT || 8080; // Use PORT from the environment or default to 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export the app for testing or additional modularity
module.exports = app;
