const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Google Apps Script URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzqml9TDxoS6J-3v1_nt9K5ntbYsqw8qdsFICcyP0ON-GN0jENfuQJXnDNpg8eiwGTF/exec';

// Proxy endpoint to handle GET requests
app.get('/api', async (req, res) => {
    try {
        console.log('Fetching data from Google Apps Script...');
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'GET',
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Data fetched successfully:', data);
            res.json(data);
        } else {
            console.error('Error fetching data from Google Apps Script:', data);
            res.status(500).json(data);
        }
    } catch (error) {
        console.error('Error during GET operation:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Proxy endpoint to handle POST requests (Add Operation)
app.post('/api/add', async (req, res) => {
    try {
        console.log('Received data for adding:', req.body);

        // Forward the request to Google Apps Script
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'add', // Specify the action for the Apps Script
                data: req.body,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Add operation successful:', result);
            res.json(result);
        } else {
            console.error('Error from Google Apps Script:', result);
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error during add operation:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
