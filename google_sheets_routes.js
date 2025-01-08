const express = require('express');
const createGoogleSheetsEntry = require('./lembur-backend-add');
const readGoogleSheetsEntries = require('./lembur-backend-read');
const updateGoogleSheetsEntry = require('./lembur-backend-update');
const deleteGoogleSheetsEntry = require('./lembur-backend-delete');
const createSPPDEntry = require('./sppd-backend-add');
const readSPPDEntry = require('./sppd-backend-read');
const lemburLembarEntry=require('./lembur-backend-lembar');
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
router.post('/sppd-add', asyncHandler(createSPPDEntry));  
router.get('/sppd-read', asyncHandler(readSPPDEntry)); 


router.get('/lembur-lembar', asyncHandler(lemburLembarEntry)); 
module.exports = router;
