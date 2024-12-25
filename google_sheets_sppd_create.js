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

const createSPPDEntry = async (req, res) => {
    try {
        const {
            namaDriver,
            asalBerangkat,
            unit,
            pemberiTugas,
            tujuan,
            tanggalMulai,
            tanggalSampai,
            durasi,
            hotel,
            budgetBiayaHarian,
            budgetBiayaPenginapan,
            totalBiayaHarian,
            totalBiayaPenginapan,
            totalBiayaSPPD,
        } = req.body;

        const newEntry = {
            id: uuidv4(),
            timestamp: getFormattedTimestamp(),
            namaDriver,
            asalBerangkat,
            unit,
            pemberiTugas,
            tujuan,
            tanggalMulai,
            tanggalSampai,
            durasi,
            hotel: hotel ? 'Yes' : 'No',
            budgetBiayaHarian,
            budgetBiayaPenginapan,
            totalBiayaHarian,
            totalBiayaPenginapan,
            totalBiayaSPPD,
        };

        // Assuming you have a function to add data to Google Sheets
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'SPPD!A1',
            valueInputOption: 'RAW',
            resource: {
                values: [Object.values(newEntry)],
            },
        });

        res.status(201).json({ message: 'SPPD entry created successfully' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({
            error: 'An error occurred while processing your request.',
            details: err.message,
        });
    }
};

module.exports = { createGoogleSheetsEntry, createSPPDEntry };
