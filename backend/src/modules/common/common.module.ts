import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Federation } from '../federation/entities/federation.entity';
import { AuditLog } from './audit/entities/audit-log.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Federation, AuditLog]),
  ],
  exports: [TypeOrmModule],
})
export class CommonModule {}