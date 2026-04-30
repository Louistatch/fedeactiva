import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CantonController } from './canton.controller';
import { CantonService } from './canton.service';
import { Region } from './entities/region.entity';
import { Prefecture } from './entities/prefecture.entity';
import { Canton } from './entities/canton.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Region, Prefecture, Canton])],
  controllers: [CantonController],
  providers: [CantonService],
  exports: [CantonService],
})
export class CantonModule {}