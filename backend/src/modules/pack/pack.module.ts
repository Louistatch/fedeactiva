import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackController } from './pack.controller';
import { PackService } from './pack.service';
import { Pack } from './entities/pack.entity';
import { Culture } from '../culture/entities/culture.entity';
import { Canton } from '../canton/entities/canton.entity';
import { Federation } from '../federation/entities/federation.entity';
import { CantonModule } from '../canton/canton.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pack, Culture, Canton, Federation]),
    CantonModule,
  ],
  controllers: [PackController],
  providers: [PackService],
  exports: [PackService],
})
export class PackModule {}