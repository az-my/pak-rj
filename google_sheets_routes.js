const express = require('express');
const createGoogleSheetsEntry = require('./google_sheets_create');
const readGoogleSheetsEntries = require('./google_sheets_read');
const updateGoogleSheetsEntry = require('./google_sheets_update');
const deleteGoogleSheetsEntry = require('./google_sheets_delete');
const createSPPDEntry = require('./sppd-backend-add');
const router = express.Router();

// Wrapper function to handle async errors
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error('Error:', err.message);
        res.status(500).json({
            error: 'An error occurred while processing your request.',
            details: err.message,
        });
    });
};

// Define routes with error handling
router.post('/add', asyncHandler(createGoogleSheetsEntry));      // Create
router.get('/list', asyncHandler(readGoogleSheetsEntries));      // Read
router.put('/update', asyncHandler(updateGoogleSheetsEntry));    // Update
router.delete('/delete', asyncHandler(deleteGoogleSheetsEntry)); // Delete

// New route to handle sppd_add
router.post('/sppd-add', asyncHandler(createSPPDEntry));         // Create SPPD Entry

module.exports = router;
