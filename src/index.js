const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Hello from Cloud Functions with Express!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Sample API endpoint
app.get('/api/hello', (req, res) => {
    const name = req.query.name || 'World';
    res.json({
        message: `Hello, ${name}!`,
        timestamp: new Date().toISOString()
    });
});

// Sample POST endpoint
app.post('/api/data', (req, res) => {
    const { data } = req.body;

    // Simulate some processing
    const processedData = {
        received: data,
        processed: true,
        timestamp: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9)
    };

    res.json(processedData);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found'
    });
});

// Export the Express app as a Cloud Function
exports.helloWorld = app;
