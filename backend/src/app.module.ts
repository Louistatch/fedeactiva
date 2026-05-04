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
import * as dns from 'dns';

// Force IPv4 pour toutes les résolutions DNS (fix Railway + Supabase)
dns.setDefaultResultOrder('ipv4first');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.THROTTLE_TTL || '60') * 1000,
      limit: parseInt(process.env.THROTTLE_LIMIT || '10'),
    }]),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const databaseUrl = process.env.DATABASE_URL;
        const useSSL = process.env.DB_SSL === 'true' || 
                       (databaseUrl && databaseUrl.includes('supabase'));

        return {
          type: 'postgres',
          url: databaseUrl,
          host: databaseUrl ? undefined : (process.env.DB_HOST || 'localhost'),
          port: databaseUrl ? undefined : parseInt(process.env.DB_PORT || '5432'),
          username: databaseUrl ? undefined : (process.env.DB_USERNAME || 'postgres'),
          password: databaseUrl ? undefined : (process.env.DB_PASSWORD || 'postgres'),
          database: databaseUrl ? undefined : (process.env.DB_DATABASE || 'fedeactiva'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: process.env.DB_SYNC === 'true',
          logging: false,
          ssl: useSSL ? { rejectUnauthorized: false } : false,
          poolSize: 3,
          connectTimeoutMS: 20000,
          extra: {
            max: 3,
            min: 1,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 20000,
            // SSL dans extra aussi pour le driver pg
            ssl: useSSL ? { rejectUnauthorized: false } : false,
          },
        };
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
