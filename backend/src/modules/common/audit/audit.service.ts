import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepo: Repository<AuditLog>,
  ) {}

  async log(
    action: string,
    options: {
      federationId?: string;
      utilisateurType?: 'super_admin' | 'admin_fed' | 'producteur';
      ressourceType?: string;
      ressourceId?: string;
      metadata?: Record<string, any>;
      ip?: string;
      userAgent?: string;
    },
  ): Promise<void> {
    try {
      const log = this.auditLogRepo.create({
        action,
        federationId: options.federationId,
        utilisateurType: options.utilisateurType,
        ressourceType: options.ressourceType,
        ressourceId: options.ressourceId,
        metadata: options.metadata || {},
        adresseIp: options.ip,
        userAgent: options.userAgent,
      });

      await this.auditLogRepo.save(log);
    } catch (error) {
      this.logger.error(`Failed to write audit log: ${error.message}`);
    }
  }

  async getLogs(filters: {
    federationId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<AuditLog[]> {
    const query = this.auditLogRepo.createQueryBuilder('log')
      .orderBy('log.created_at', 'DESC');

    if (filters.federationId) {
      query.andWhere('log.federation_id = :federationId', { federationId: filters.federationId });
    }
    if (filters.action) {
      query.andWhere('log.action = :action', { action: filters.action });
    }
    if (filters.startDate) {
      query.andWhere('log.created_at >= :startDate', { startDate: filters.startDate });
    }
    if (filters.endDate) {
      query.andWhere('log.created_at <= :endDate', { endDate: filters.endDate });
    }
    if (filters.limit) {
      query.limit(filters.limit);
    }

    return query.getMany();
  }
}