import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { OrderService } from '../order/order.service';
import { OrderModule } from '../order/order.module';
import { Commande } from '../order/entities/commande.entity';
import { WebhookLog } from './entities/webhook-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Commande, WebhookLog]),
    OrderModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}