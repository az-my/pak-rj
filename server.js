const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

// Initialize Express
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Load service account credentials
const credentials = JSON.parse(fs.readFileSync('path/to/your-service-account.json'));

// Authorize Google Sheets API
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
});
const sheets = google.sheets({ version: 'v4', auth });

// Replace with your Google Sheet ID
const SPREADSHEET_ID = 'your-google-sheet-id';

// Endpoint: Get all data from Google Sheets
app.get('/api/data', async (req, res) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1', // Replace 'Sheet1' with your sheet name
        });
        res.json({ data: response.data.values });
    } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).json({ error: 'Failed to fetch data', details: error.message });
    }
});

// Endpoint: Add data to Google Sheets
app.post('/api/add', async (req, res) => {
    try {
        const { name, unit, description } = req.body; // Example input fields
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1', // Replace 'Sheet1' with your sheet name
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[name, unit, description, new Date().toISOString()]], // Add data in the correct order
            },
        });
        res.json({ message: 'Data added successfully' });
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).json({ error: 'Failed to add data', details: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
