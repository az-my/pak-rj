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

        // Sort data by the second column (descending order)
        const sortedData = response.data.values.sort((a, b) => {
            // Parse dates in the second column for comparison
            return new Date(b[1]) - new Date(a[1]);
        });

        // Return the sorted data
        res.json({ data: sortedData });
    } catch (error) {
        // Handle API errors
        res.status(500).json({
            error: 'Failed to fetch data from Google Sheets',
            details: error.message,
        });
    }
};

module.exports = readGoogleSheetsEntries;
