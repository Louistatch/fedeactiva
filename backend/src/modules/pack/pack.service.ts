import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pack, PackStatut } from './entities/pack.entity';
import { CreatePackDto } from './dto/create-pack.dto';
import { CantonService } from '../canton/canton.service';

@Injectable()
export class PackService {
  constructor(
    @InjectRepository(Pack)
    private packRepo: Repository<Pack>,
    private cantonService: CantonService,
  ) {}

  async create(federationId: string, dto: CreatePackDto): Promise<Pack> {
    const pack = this.packRepo.create({
      ...dto,
      federationId,
      stockTotal: dto.stockTotal || 999999,
      stockDisponible: dto.stockDisponible || dto.stockTotal || 999999,
    });
    return this.packRepo.save(pack);
  }

  async findAll(federationId: string): Promise<Pack[]> {
    return this.packRepo.find({
      where: { federationId },
      relations: ['culture', 'modeleExcel', 'modeleWord'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllPublished(federationId: string): Promise<Pack[]> {
    return this.packRepo.find({
      where: { federationId, statut: PackStatut.PUBLIE },
      relations: ['culture'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Pack> {
    const pack = await this.packRepo.findOne({
      where: { id },
      relations: ['culture', 'federation', 'modeleExcel', 'modeleWord'],
    });
    if (!pack) {
      throw new NotFoundException(`Pack ${id} non trouvé`);
    }
    return pack;
  }

  async findBySlug(federationSlug: string, cultureId: string, cantonId: number): Promise<Pack> {
    const pack = await this.packRepo
      .createQueryBuilder('pack')
      .leftJoinAndSelect('pack.culture', 'culture')
      .leftJoinAndSelect('pack.federation', 'federation')
      .where('federation.slug = :slug', { slug: federationSlug })
      .andWhere('pack.cultureId = :cultureId', { cultureId })
      .andWhere('pack.cantonId = :cantonId', { cantonId })
      .getOne();

    if (!pack) {
      throw new NotFoundException(`Pack non trouvé`);
    }
    return pack;
  }

  async update(id: string, dto: Partial<CreatePackDto>): Promise<Pack> {
    const pack = await this.findOne(id);
    Object.assign(pack, dto);
    return this.packRepo.save(pack);
  }

  async publish(id: string): Promise<Pack> {
    const pack = await this.findOne(id);
    pack.statut = PackStatut.PUBLIE;
    return this.packRepo.save(pack);
  }

  async archive(id: string): Promise<Pack> {
    const pack = await this.findOne(id);
    pack.statut = PackStatut.ARCHIVE;
    return this.packRepo.save(pack);
  }

  async decrementStock(id: string, quantity: number = 1): Promise<void> {
    const result = await this.packRepo
      .createQueryBuilder()
      .update()
      .set({ stockDisponible: () => `stock_disponible - ${quantity}` })
      .where('id = :id', { id })
      .andWhere('stock_disponible >= :qty', { qty: quantity })
      .execute();

    if (result.affected === 0) {
      const pack = await this.packRepo.findOne({ where: { id } });
      if (!pack) {
        throw new NotFoundException(`Pack ${id} non trouvé`);
      }
      throw new Error(`Stock insuffisant. Disponible: ${pack.stockDisponible}, Demandé: ${quantity}`);
    }
  }

  async getStats(federationId: string): Promise<any> {
    return this.packRepo
      .createQueryBuilder('pack')
      .leftJoin('pack.culture', 'culture')
      .select([
        'culture.nom as culture',
        'COUNT(*) as total_packs',
        'SUM(CASE WHEN pack.statut = \'publie\' THEN 1 ELSE 0 END) as packs_publies',
        'SUM(pack.nombre_ventes) as total_ventes',
        'SUM(pack.nombre_ventes * pack.prix_unitaire) as revenus',
      ])
      .where('pack.federation_id = :federationId', { federationId })
      .groupBy('culture.id')
      .getRawMany();
  }
}