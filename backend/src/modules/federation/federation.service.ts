import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Federation } from './entities/federation.entity';
import { CreateFederationDto } from './dto/create-federation.dto';
import { UpdateFederationDto } from './dto/update-federation.dto';

@Injectable()
export class FederationService {
  private readonly logger = new Logger(FederationService.name);

  constructor(
    @InjectRepository(Federation)
    private federationRepo: Repository<Federation>,
  ) {}

  async create(dto: CreateFederationDto): Promise<Federation> {
    const federation = this.federationRepo.create({
      ...dto,
      apiKey: this.generateApiKey(),
    });
    return this.federationRepo.save(federation);
  }

  async findAll(page: number = 1, limit: number = 20): Promise<{ data: Federation[], total: number, page: number, totalPages: number }> {
    const [data, total] = await this.federationRepo.findAndCount({
      order: { nom: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Federation> {
    const federation = await this.federationRepo.findOne({ where: { id } });
    if (!federation) {
      throw new NotFoundException(`Fédération ${id} non trouvée`);
    }
    return federation;
  }

  async findBySlug(slug: string): Promise<Federation> {
    const federation = await this.federationRepo.findOne({ where: { slug } });
    if (!federation) {
      throw new NotFoundException(`Fédération ${slug} non trouvée`);
    }
    return federation;
  }

  async update(id: string, dto: UpdateFederationDto): Promise<Federation> {
    const federation = await this.findOne(id);
    Object.assign(federation, dto);
    return this.federationRepo.save(federation);
  }

  async remove(id: string): Promise<void> {
    const federation = await this.findOne(id);
    await this.federationRepo.remove(federation);
  }

  async regenerateApiKey(id: string): Promise<Federation> {
    const federation = await this.findOne(id);
    federation.apiKey = this.generateApiKey();
    return this.federationRepo.save(federation);
  }

  async getStats(): Promise<any> {
    const stats = await this.federationRepo
      .createQueryBuilder('f')
      .leftJoin('f.cultures', 'c')
      .leftJoin('c.packs', 'p')
      .select([
        'f.id as id',
        'f.nom as nom',
        'f.slug as slug',
        'COUNT(DISTINCT c.id) as total_cultures',
        'COUNT(DISTINCT CASE WHEN p.statut = \'publie\' THEN p.id END) as packs_publies',
      ])
      .groupBy('f.id')
      .getRawMany();

    return stats;
  }

  private generateApiKey(): string {
    return `fk_live_${uuidv4().replace(/-/g, '')}`;
  }
}
