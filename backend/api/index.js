// Vercel Serverless Function for NestJS - OPTIMIZED
const { NestFactory } = require('@nestjs/core');

// Cache global de l'app NestJS
let cachedApp = null;
let isInitializing = false;

async function getOrCreateApp() {
  if (cachedApp) return cachedApp;

  if (isInitializing) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return getOrCreateApp();
  }

  isInitializing = true;

  try {
    const { AppModule } = require('../dist/app.module');

    const app = await NestFactory.create(AppModule, {
      logger: false,
      abortOnError: false,
    });

    app.enableCors({ origin: '*', credentials: true });
    app.setGlobalPrefix('api/v1');

    await app.init();
    cachedApp = app;
    console.log('✅ NestJS initialized');
    return app;
  } catch (error) {
    console.error('❌ NestJS init failed:', error.message);
    throw error;
  } finally {
    isInitializing = false;
  }
}

module.exports = async (req, res) => {
  try {
    const app = await getOrCreateApp();
    app.getHttpAdapter().getInstance()(req, res);
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
