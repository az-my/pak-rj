const { v4: uuidv4 } = require('uuid');
const { getFormattedTimestamp } = require('./utility_timestamp');
const { sheets } = require('./google_sheets_service');

const createGoogleSheetsEntry = async (req, res) => {
    try {
        const {
            name,
            unit,
            description,
            date,
            day,
            day_status,
            start_time,
            end_time,
            duration_hours,
            total_hours,
            hourly_rate,
            total_cost,
        } = req.body;

        // Validate required fields
        if (
            !name ||
            !unit ||
            !description ||
            !date ||
            !day ||
            !day_status ||
            !start_time ||
            !end_time ||
            !duration_hours ||
            !total_hours ||
            !hourly_rate ||
            !total_cost
        ) {
            return res.status(400).json({ error: 'Missing required fields. Please ensure all fields are filled out.' });
        }

        // Generate UUID and timestamp
        const uuid = uuidv4();
        const timestamp = getFormattedTimestamp();

        // Append data to Google Sheets
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'database_lembur',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [
                    [
                        uuid,
                        timestamp,
                        name,
                        unit,
                        description,
                        date,
                        day,
                        day_status,
                        start_time,
                        end_time,
                        duration_hours,
                        total_hours,
                        hourly_rate,
                        total_cost,
                    ],
                ],
            },
        });

        // Respond with success message
        res.json({ message: 'Data added successfully', uuid, created_date: timestamp });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add data to Google Sheets', details: error.message });
    }
};

module.exports = createGoogleSheetsEntry;
