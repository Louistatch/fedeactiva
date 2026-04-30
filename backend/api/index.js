// Vercel Serverless Function for NestJS - OPTIMIZED
const express = require('express');
const { NestFactory } = require('@nestjs/core');

// Cache global de l'app NestJS
let cachedApp = null;
let isInitializing = false;

async function getOrCreateApp() {
  // Si l'app existe déjà, la retourner immédiatement
  if (cachedApp) {
    return cachedApp;
  }

  // Si une initialisation est en cours, attendre
  if (isInitializing) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return getOrCreateApp();
  }

  isInitializing = true;

  try {
    // Import dynamique pour réduire le cold start
    const { AppModule } = require('../dist/app.module');
    
    // Créer l'app NestJS avec options optimisées
    const app = await NestFactory.create(AppModule, {
      logger: false, // Désactiver les logs pour accélérer
      abortOnError: false,
    });

    // CORS minimal
    app.enableCors({
      origin: '*',
      credentials: true,
    });

    // Pas de global prefix pour réduire la latence
    // app.setGlobalPrefix('api/v1');

    await app.init();
    
    cachedApp = app;
    console.log('✅ NestJS app cached');
    
    return app;
  } catch (error) {
    console.error('❌ Failed to initialize NestJS:', error.message);
    throw error;
  } finally {
    isInitializing = false;
  }
}

// Export du handler Vercel
module.exports = async (req, res) => {
  try {
    const app = await getOrCreateApp();
    const server = app.getHttpAdapter().getInstance();
    
    // Passer la requête à Express/NestJS
    server(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
