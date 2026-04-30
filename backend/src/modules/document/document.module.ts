import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { ModeleDocument } from './entities/modele-document.entity';
import { CommandeLigne } from '../order/entities/commande-ligne.entity';
import { Commande } from '../order/entities/commande.entity';
import { Producteur } from '../user/entities/producteur.entity';
import { Pack } from '../pack/entities/pack.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModeleDocument, CommandeLigne, Commande, Producteur, Pack])],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}