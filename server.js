require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const googleSheetsRoutes = require('./google_sheets_routes');


const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Overtime Management App!');
});

// Google Sheets API routes
app.use('/api/google-sheets', googleSheetsRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'App is running' });
});

// Handle 404 for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
