const { v4: uuidv4 } = require('uuid');
const { getFormattedTimestamp } = require('./utils-timestamp');
const { sheets } = require('./google_sheets_service');

const createSPPDEntry = async (req, res) => {
    try {
        const {
            namaDriver,
            asalBerangkat,
            unit,
            pemberiTugas,
            tujuan,
            maksud_perjalanan,
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

            // Check for missing required fields
            const requiredFields = {
                hotel,
                namaDriver,
                asalBerangkat,
                unit,
                pemberiTugas,
                tujuan,
                tanggalMulai,
                tanggalSampai,
                durasi,
                budgetBiayaHarian,
                budgetBiayaPenginapan,
                totalBiayaHarian,
                totalBiayaPenginapan,
                totalBiayaSPPD
            };

            const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);

            if (missingFields.length > 0) {
                console.log("Missing required fields:", missingFields);
                return res.status(400).json({ error: 'Missing required fields. Please ensure all fields are filled out.', missingFields });
            }

        // Generate UUID and timestamp
        const uuid = uuidv4();
        const timestamp = getFormattedTimestamp();

        const newEntry = {
            id: uuid,
            timestamp,
            namaDriver,
            asalBerangkat,
            unit,
            pemberiTugas,
            tujuan,
            maksud_perjalanan,
            tanggalMulai,
            tanggalSampai,
            durasi,
            hotel,
            budgetBiayaHarian,
            budgetBiayaPenginapan,
            totalBiayaHarian,
            totalBiayaPenginapan,
            totalBiayaSPPD,
        };

        // Debugging: Log the new entry
        console.log('New SPPD Entry:', newEntry);

        // Append data to Google Sheets
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'SPPD!A1',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [
                    [
                        uuid,
                        timestamp,
                        namaDriver,
                        asalBerangkat,
                        unit,
                        pemberiTugas,
                        tujuan,
                        maksud_perjalanan,
                        tanggalMulai,
                        tanggalSampai,
                        durasi,
                        hotel,
                        budgetBiayaHarian,
                        budgetBiayaPenginapan,
                        totalBiayaHarian,
                        totalBiayaPenginapan,
                        totalBiayaSPPD,
                    ],
                ],
            },
        });

        // Log the response from Google Sheets API
        console.log('Google Sheets API Response:', response);

        res.status(201).json({ message: 'SPPD entry created successfully' });
    } catch (err) {
        console.error('Error:', err.message);
        console.error('Stack Trace:', err.stack);

        // Detailed error response
        res.status(500).json({
            error: 'An error occurred while processing your request.',
            details: err.message,
            stack: err.stack,
            suggestion: 'Please check the server logs for more details and ensure that the Google Sheets API credentials and spreadsheet ID are correctly configured.',
        });
    }
};

module.exports = createSPPDEntry;