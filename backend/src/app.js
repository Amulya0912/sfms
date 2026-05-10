require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');


const { correlationId } = require('./middlewares/correlationId');
const { requestLogger } = require('./middlewares/requestLogger');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: false })); // Allow serving static uploads
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(compression());

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom Middlewares
app.use(correlationId);
app.use(requestLogger);

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1', routes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
