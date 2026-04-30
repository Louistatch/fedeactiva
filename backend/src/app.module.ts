import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { FederationModule } from './modules/federation/federation.module';
import { CultureModule } from './modules/culture/culture.module';
import { CantonModule } from './modules/canton/canton.module';
import { PackModule } from './modules/pack/pack.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { UserModule } from './modules/user/user.module';
import { DocumentModule } from './modules/document/document.module';
import { NotificationModule } from './modules/notification/notification.module';
import { StorageModule } from './modules/storage/storage.module';
import { CommonModule } from './modules/common/common.module';
import { TenantMiddleware } from './modules/common/middlewares/tenant.middleware';
import { AuditModule } from './modules/common/audit/audit.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true, // Cache la config
    }),
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.THROTTLE_TTL || '60') * 1000,
      limit: parseInt(process.env.THROTTLE_LIMIT || '10'),
    }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'fedeactiva',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Toujours false en production
      logging: false, // Désactiver les logs SQL
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      poolSize: 5, // Réduire le pool de connexions
      connectTimeoutMS: 10000,
      extra: {
        family: 4,
        max: 5, // Max 5 connexions
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      },
    }),
    CommonModule,
    AuthModule,
    FederationModule,
    CultureModule,
    CantonModule,
    PackModule,
    OrderModule,
    PaymentModule,
    UserModule,
    DocumentModule,
    NotificationModule,
    StorageModule,
    AuditModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
