const express = require('express');
const createGoogleSheetsEntry = require('./google_sheets_create');
const readGoogleSheetsEntries = require('./google_sheets_read');
const updateGoogleSheetsEntry = require('./google_sheets_update');
const deleteGoogleSheetsEntry = require('./google_sheets_delete');

const router = express.Router();

router.post('/add', createGoogleSheetsEntry);       // Create
router.get('/list', readGoogleSheetsEntries);       // Read
router.put('/update', updateGoogleSheetsEntry);     // Update
router.delete('/delete', deleteGoogleSheetsEntry);  // Delete

module.exports = router;
