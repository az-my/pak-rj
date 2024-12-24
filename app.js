
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const googleSheetsRoutes = require('./google_sheets_routes');
require('dotenv').config(); // Ensure environment variables are loaded
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Mount routes
app.use('/api/google-sheets', googleSheetsRoutes);

module.exports = app;
