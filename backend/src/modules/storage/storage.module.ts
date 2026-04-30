import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DownloadController } from './download.controller';
import { DownloadService } from './download.service';
import { DownloadToken } from './entities/download-token.entity';
import { CommandeLigne } from '../order/entities/commande-ligne.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DownloadToken, CommandeLigne])],
  controllers: [DownloadController],
  providers: [DownloadService],
  exports: [DownloadService],
})
export class StorageModule {}