const { google } = require('googleapis');
const credentials = require('./credential.json');

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
    ],
});

const sheets = google.sheets({ version: 'v4', auth });

module.exports = { sheets };
