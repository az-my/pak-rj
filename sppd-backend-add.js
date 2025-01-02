const { v4: uuidv4 } = require("uuid");
const { getFormattedTimestamp } = require("./utils-timestamp");
const { sheets } = require("./google_sheets_service");

// 💡 HELPER FUNCTIONS
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const validateRequiredFields = (fields) => {
  return Object.keys(fields).filter((field) => !fields[field]);
};

const fetchExistingData = async (spreadsheetId, range) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    if (!response.data.values) {
      return [];
    }
    return response.data.values;
  } catch (error) {
    throw new Error(`📉 Failed to fetch data: ${error.message}`);
  }
};

const findDriverEntries = (dataRows, headerRow, driverName) => {
  if (!headerRow || headerRow.length === 0) {
    throw new Error("❌ Header row is missing or empty!");
  }
  const namaDriverIndex = headerRow.indexOf("NAMA_DRIVER");
  if (namaDriverIndex === -1) {
    throw new Error("❌ 'namaDriver' column not found!");
  }
  return dataRows.filter((row) => row[namaDriverIndex] === driverName);
};

const resolveDateConflict = (driverEntries, headerRow, newTanggalMulai) => {
  if (!headerRow) {
    throw new Error("❌ Header row is not defined!");
  }
  const tanggalSelesaiIndex = headerRow.indexOf("TANGGAL_SELESAI");
  if (tanggalSelesaiIndex === -1) {
    throw new Error("❌ 'tanggalSampai' column not found!");
  }

  if (driverEntries.length === 0) {
    return newTanggalMulai;
  }

  let isConflict;
  do {
    isConflict = driverEntries.some((row) => {
      const existingTanggalSelesai = row[tanggalSelesaiIndex];
      if (!existingTanggalSelesai) return false;

      return formatDate(parseDate(existingTanggalSelesai)) === newTanggalMulai;
    });

    if (isConflict) {
      const parsedDate = parseDate(newTanggalMulai);
      parsedDate.setDate(parsedDate.getDate() + 1);
      newTanggalMulai = formatDate(parsedDate);
    }
  } while (isConflict);

  return newTanggalMulai;
};

// 🚀 MAIN FUNCTION
/**
 * Creates a new SPPD entry in the Google Sheets.
 * 
 * @param {Object} req - The request object containing the SPPD entry details.
 * @param {Object} res - The response object to send the result.
 * @returns {Promise<void>} - A promise that resolves when the entry is created.
 */
const createSPPDEntry = async (req, res) => {
  try {
    const {
      namaDriver,
      asalBerangkat,
      unit,
      pemberiTugas,
      tujuan,
      alatAngkutan,
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

    const requiredFields = {
      namaDriver,
      asalBerangkat,
      unit,
      pemberiTugas,
      tujuan,
      alatAngkutan,
      tanggalMulai,
      tanggalSampai,
      durasi,
      hotel,
      budgetBiayaHarian,
      budgetBiayaPenginapan,
      totalBiayaHarian,
    };

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(tanggalMulai) || !dateRegex.test(tanggalSampai)) {
      return res.status(400).json({
        error: "🛑 Invalid date format! Use DD/MM/YYYY.",
      });
    }

    const missingFields = validateRequiredFields(requiredFields);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "🛑 Missing required fields!",
        missingFields,
      });
    }

    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) {
      return res.status(500).json({
        error: "💥 Spreadsheet ID is not defined in environment variables!",
      });
    }

    const existingData = await fetchExistingData(spreadsheetId, "SPPD!A1:Z1000");
    const headerRow = existingData[0];
    if (!headerRow) {
      return res.status(500).json({
        error: "⚠️ No header row found!",
      });
    }

    const dataRows = existingData.slice(1);
    const driverEntries = findDriverEntries(dataRows, headerRow, namaDriver);

    const adjustedTanggalMulai = resolveDateConflict(
      driverEntries,
      headerRow,
      tanggalMulai
    );

    const uuid = uuidv4();
    const timestamp = getFormattedTimestamp();

    const newEntry = [
      uuid,
      timestamp,
      namaDriver,
      asalBerangkat,
      unit,
      pemberiTugas,
      tujuan,
      alatAngkutan,
      maksud_perjalanan,
      adjustedTanggalMulai,
      tanggalSampai,
      durasi,
      hotel,
      budgetBiayaHarian,
      budgetBiayaPenginapan,
      totalBiayaHarian,
      totalBiayaPenginapan,
      totalBiayaSPPD,
    ];

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "SPPD!A1",
        valueInputOption: "USER_ENTERED",
        resource: { values: [newEntry] },
      });

      res.status(201).json({ message: "🎉 SPPD entry created successfully!" });
    } catch (appendError) {
      console.error("🔥 Error appending data to Google Sheets:", {
        message: appendError.message,
        stack: appendError.stack,
      });

      res.status(500).json({
        error: "💥 Failed to append data to Google Sheets!",
        details: appendError.message,
        stack: appendError.stack,
      });
    }
  } catch (err) {
    console.error("🔥 Error Details:", {
      message: err.message,
      stack: err.stack,
    });

    res.status(500).json({
      error: "💥 Something went wrong!",
      details: err.message,
      stack: err.stack,
      suggestion:
        "🛠️ Check the server logs for more details. Make sure your Google Sheets API creds are 🔑!",
    });
  }
};

module.exports = createSPPDEntry;