import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Commande } from './entities/commande.entity';
import { CommandeLigne } from './entities/commande-ligne.entity';
import { Pack } from '../pack/entities/pack.entity';
import { Producteur } from '../user/entities/producteur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commande, CommandeLigne, Pack, Producteur])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}