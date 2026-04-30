import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FederationController } from './federation.controller';
import { FederationService } from './federation.service';
import { Federation } from './entities/federation.entity';
import { Culture } from '../culture/entities/culture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Federation, Culture])],
  controllers: [FederationController],
  providers: [FederationService],
  exports: [FederationService],
})
export class FederationModule {}
