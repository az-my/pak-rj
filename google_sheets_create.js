const { v4: uuidv4 } = require('uuid');
const { getFormattedTimestamp } = require('./utility_timestamp');
const { sheets } = require('./google_sheets_service');

const createGoogleSheetsEntry = async (req, res) => {
    try {
        const { name, unit, description } = req.body;

        if (!name || !unit || !description) {
            return res.status(400).json({ error: 'Missing required fields: name, unit, or description' });
        }

        const uuid = uuidv4();
        const timestamp = getFormattedTimestamp();

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'database_lembur',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[uuid, timestamp, name, unit, description]],
            },
        });

        res.json({ message: 'Data added successfully', uuid, created_date: timestamp });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add data to Google Sheets', details: error.message });
    }
};

module.exports = createGoogleSheetsEntry;
