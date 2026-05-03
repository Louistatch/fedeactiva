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
      // Utiliser l'URL complète si disponible, sinon les paramètres individuels
      url: process.env.DATABASE_URL || undefined,
      host: process.env.DATABASE_URL ? undefined : (process.env.DB_HOST || 'localhost'),
      port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DATABASE_URL ? undefined : (process.env.DB_USERNAME || 'postgres'),
      password: process.env.DATABASE_URL ? undefined : (process.env.DB_PASSWORD || 'postgres'),
      database: process.env.DATABASE_URL ? undefined : (process.env.DB_DATABASE || 'fedeactiva'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: false,
      ssl: { rejectUnauthorized: false }, // Toujours SSL pour Supabase
      poolSize: 5,
      connectTimeoutMS: 15000,
      extra: {
        family: 4, // Force IPv4
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 15000,
        ssl: { rejectUnauthorized: false },
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
