const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // For forwarding requests

const app = express();
const PORT = process.env.PORT || 3000;

// Google Apps Script Web App URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby3cV7W_amDlJ6rr-8QyEwkXjDCrHGd_tycgJctFoDtdqdQAngjnK1ni0WITkCvDMC7/exec';

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Utility function to log errors
function logErrorDetails(endpoint, error, reqBody = null) {
    console.error(`\n=== ERROR in ${endpoint} ===`);
    console.error(`Message: ${error.message}`);
    if (reqBody) {
        console.error(`Request Body: ${JSON.stringify(reqBody)}`);
    }
    console.error(`Stack: ${error.stack}`);
    console.error(`===========================\n`);
}

// Proxy endpoint to handle GET requests
app.get('/api', async (req, res) => {
    console.log(`Incoming GET request at ${new Date().toISOString()}`);
    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, { method: 'GET' });

        if (!response.ok) {
            throw new Error(`Google Apps Script returned status ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`GET response: ${JSON.stringify(data)}`);
        res.json(data); // Send the response back to the client
    } catch (error) {
        logErrorDetails('GET /api', error);
        res.status(500).json({
            error: 'Something went wrong in GET',
            details: error.message,
        });
    }
});

// Proxy endpoint to handle POST requests
app.post('/api', async (req, res) => {
    console.log(`Incoming POST request at ${new Date().toISOString()}`);
    console.log(`Request Body: ${JSON.stringify(req.body)}`);
    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });

        if (!response.ok) {
            throw new Error(`Google Apps Script returned status ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`POST response: ${JSON.stringify(data)}`);
        res.json(data); // Send the response back to the client
    } catch (error) {
        logErrorDetails('POST /api', error, req.body);
        res.status(500).json({
            error: 'Something went wrong in POST',
            details: error.message,
        });
    }
});

// 404 Error Handler for undefined routes
app.use((req, res) => {
    console.error(`404 - Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Route not found',
        details: `No route matching ${req.method} ${req.originalUrl}`,
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(`\n=== GLOBAL ERROR HANDLER ===`);
    console.error(`Message: ${err.message}`);
    console.error(`Stack: ${err.stack}`);
    console.error(`============================\n`);
    res.status(500).json({
        error: 'Internal Server Error',
        details: err.message,
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
