const { google } = require('googleapis');

const rawCredentials = process.env.GOOGLE_CREDENTIALS;

if (!rawCredentials) {
    throw new Error('GOOGLE_CREDENTIALS environment variable is not set.');
}

let credentials;
try {
    credentials = JSON.parse(rawCredentials);

    // Replace escaped newlines in the private key
    if (credentials.private_key) {
        credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }
} catch (error) {
    throw new Error('Failed to parse GOOGLE_CREDENTIALS. Ensure it is valid JSON.');
}

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
    ],
});

const sheets = google.sheets({ version: 'v4', auth });

module.exports = { sheets };
