const { sheets } = require('./google_sheets_service');

const readGoogleSheetsEntries = async (req, res) => {
    try {
        // Check if SPREADSHEET_ID is defined
        if (!process.env.SPREADSHEET_ID) {
            return res.status(500).json({
                error: 'Failed to fetch data from Google Sheets',
                details: 'SPREADSHEET_ID is not defined in the environment variables',
            });
        }

        // Fetch data from Google Sheets
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'database_lembur', // Adjust this if your range differs
        });

        // Check if data exists
        if (!response.data.values || response.data.values.length === 0) {
            return res.status(404).json({ error: 'No data found in the sheet' });
        }

        // Return the data
        res.json({ data: response.data.values });
    } catch (error) {
        // Handle API errors
        res.status(500).json({
            error: 'Failed to fetch data from Google Sheets',
            details: error.message,
        });
    }
};

module.exports = readGoogleSheetsEntries;
