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

// Check required fields 🕵️‍♀️
const validateRequiredFields = (fields) => {
  return Object.keys(fields).filter((field) => !fields[field]);
};

// Get existing data from Sheets 📄
const fetchExistingData = async (spreadsheetId, range) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    return response.data.values || [];
  } catch (error) {
    throw new Error(`📉 Failed to fetch data: ${error.message}`);
  }
};

// Filter rows for a specific driver 🚗
const findDriverEntries = (dataRows, headerRow, driverName) => {
  const namaDriverIndex = headerRow.indexOf("namaDriver");
  if (namaDriverIndex === -1) {
    throw new Error("❌ 'namaDriver' column not found!");
  }
  return dataRows.filter((row) => row[namaDriverIndex] === driverName);
};

// Handle date conflicts like a boss 🗓️
const resolveDateConflict = (driverEntries, headerRow, newTanggalMulai) => {
  const tanggalSelesaiIndex = headerRow.indexOf("tanggalSampai");
  if (tanggalSelesaiIndex === -1) {
    throw new Error("❌ 'tanggalSampai' column not found!");
  }

  // Keep adjusting newTanggalMulai until there's no overlap ⏩
  while (
    driverEntries.some(
      (row) =>
        formatDate(parseDate(row[tanggalSelesaiIndex])) === newTanggalMulai
    )
  ) {
    const parsedDate = parseDate(newTanggalMulai);
    parsedDate.setDate(parsedDate.getDate() + 1); // ⏩ +1 day
    newTanggalMulai = formatDate(parsedDate);
  }
  return newTanggalMulai;
};

// 🚀 MAIN FUNCTION
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

    // 🛑 Missing fields? Not today!
    const requiredFields = {
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
    };
    const missingFields = validateRequiredFields(requiredFields);
    if (missingFields.length > 0) {
      console.log("🚨 Missing Fields:", missingFields);
      return res.status(400).json({
        error: "🛑 Missing required fields!",
        missingFields,
      });
    }

    // 📡 Fetch existing data
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = "SPPD!A1:Z";
    const existingData = await fetchExistingData(spreadsheetId, range);

    const headerRow = existingData[0];
    if (!headerRow) throw new Error("⚠️ No header row found!");

    const dataRows = existingData.slice(1);
    const driverEntries = findDriverEntries(dataRows, headerRow, namaDriver);

    // 🗓️ Adjust tanggalMulai if there's a conflict
    const adjustedTanggalMulai = resolveDateConflict(
      driverEntries,
      headerRow,
      tanggalMulai
    );

    // 🎉 All good, let’s create the entry!
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

    // 🚀 Push to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "SPPD!A1",
      valueInputOption: "USER_ENTERED",
      resource: { values: [newEntry] },
    });

    res.status(201).json({ message: "🎉 SPPD entry created successfully!" });
  } catch (err) {
    // 🚨 Uh-oh! Log all the things!
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
