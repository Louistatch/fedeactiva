// Vercel Serverless Function for NestJS
const express = require('express');

// Simple Express fallback - NestJS is too heavy for serverless
const app = express();

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'FedeActiva API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

app.get('/api', (req, res) => {
  res.json({
    name: 'FedeActiva API',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      docs: 'https://github.com/Louistatch/fedeactiva'
    }
  });
});

// Auth endpoints placeholder
app.post('/api/auth/login', (req, res) => {
  res.status(501).json({
    statusCode: 501,
    message: 'Auth endpoints not yet implemented in serverless mode',
    suggestion: 'Use Railway or Render for full NestJS deployment'
  });
});

app.post('/api/auth/register', (req, res) => {
  res.status(501).json({
    statusCode: 501,
    message: 'Auth endpoints not yet implemented in serverless mode',
    suggestion: 'Use Railway or Render for full NestJS deployment'
  });
});

// Catch all
app.all('*', (req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: ['/api', '/api/health', '/api/auth/login', '/api/auth/register']
  });
});

module.exports = app;
