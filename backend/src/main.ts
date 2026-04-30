import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  // Validate CORS origins in production
  const corsOrigins = process.env.CORS_ORIGINS?.split(',').map(o => o.trim()) || [];
  
  if (process.env.NODE_ENV === 'production' && corsOrigins.length === 0) {
    throw new Error('CORS_ORIGINS must be defined in production');
  }

  // Default to localhost only in development
  const allowedOrigins = corsOrigins.length > 0 
    ? corsOrigins 
    : ['http://localhost:3000', 'http://localhost:5173'];

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Federation-Slug'],
    },
  });

  // Sécurité HTTP
  app.use(helmet());

  // Validation des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Prefix API
  app.setGlobalPrefix('api/v1');

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('FedeActiva API')
    .setDescription('API Multi-tenant pour plateforme de packs documentaires agricoles')
    .setVersion('2.0.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentification')
    .addTag('Federations', 'Gestion des fédérations')
    .addTag('Cultures', 'Cultures agricoles')
    .addTag('Cantons', 'Découpage géographique')
    .addTag('Packs', 'Packs documentaires')
    .addTag('Orders', 'Commandes')
    .addTag('Payment', 'Paiements FedaPay')
    .addTag('Documents', 'Génération de documents')
    .addTag('Users', 'Utilisateurs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 FedeActiva API running on port ${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
