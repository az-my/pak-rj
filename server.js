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

// Root route for the server
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Overtime Management API Proxy!',
        endpoints: {
            get: '/api',
            post: '/api',
        },
    });
});

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
        console.error(`Error in GET /api: ${error.message}`);
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
        console.error(`Error in POST /api: ${error.message}`);
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

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
