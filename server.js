const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // For forwarding requests

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Proxy endpoint to handle POST requests
app.post('/api', async (req, res) => {
    try {
        // Replace with your Google Apps Script web app URL
        const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby3cV7W_amDlJ6rr-8QyEwkXjDCrHGd_tycgJctFoDtdqdQAngjnK1ni0WITkCvDMC7/exec';

        // Forward the request to Google Apps Script
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        res.json(data); // Send the response back to the client
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Proxy endpoint to handle GET requests
app.get('/api', async (req, res) => {
    try {
        const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'GET',
        });

        const data = await response.json();
        res.json(data); // Send the response back to the client
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
