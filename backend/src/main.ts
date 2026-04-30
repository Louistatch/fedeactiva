import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
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
