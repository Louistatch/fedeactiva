import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Federation } from '../../federation/entities/federation.entity';

declare global {
  namespace Express {
    interface Request {
      federation?: Federation;
      federationSlug?: string;
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Federation)
    private federationRepo: Repository<Federation>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Extract federation from various sources
    let federationSlug: string | undefined;
    let federationApiKey: string | undefined;

    // 1. From URL slug (e.g., /embed/fenomat/...)
    const urlMatch = req.path.match(/\/embed\/([a-z0-9-]+)/);
    if (urlMatch) {
      federationSlug = urlMatch[1];
    }

    // 2. From subdomain (e.g., fenomat.public.fedeactiva.tg)
    const host = req.get('host') || '';
    const subdomainMatch = host.match(/^([a-z0-9-]+)\./);
    if (subdomainMatch) {
      federationSlug = subdomainMatch[1];
    }

    // 3. From header (x-federation-slug or x-federation-key)
    if (!federationSlug) {
      federationSlug = req.get('x-federation-slug');
    }
    if (!federationApiKey) {
      federationApiKey = req.get('x-federation-key');
    }

    // Store slug for later use
    req.federationSlug = federationSlug;

    // For public endpoints, try to find federation
    if (federationSlug || federationApiKey) {
      try {
        let federation: Federation | null = null;

        if (federationApiKey) {
          federation = await this.federationRepo.findOne({
            where: { apiKey: federationApiKey },
          });
        } else if (federationSlug) {
          federation = await this.federationRepo.findOne({
            where: { slug: federationSlug, active: true },
          });
        }

        if (federation) {
          req.federation = federation;
        } else if (!req.path.startsWith('/api/v1/auth')) {
          // Allow auth endpoints without federation
          throw new BadRequestException('Fédération non trouvée ou inactive');
        }
      } catch (error) {
        if (!req.path.startsWith('/api/v1/auth')) {
          next(error);
          return;
        }
      }
    }

    next();
  }
}