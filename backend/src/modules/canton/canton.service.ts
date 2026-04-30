import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';
import { Prefecture } from './entities/prefecture.entity';
import { Canton } from './entities/canton.entity';

@Injectable()
export class CantonService {
  constructor(
    @InjectRepository(Region)
    private regionRepo: Repository<Region>,
    @InjectRepository(Prefecture)
    private prefectureRepo: Repository<Prefecture>,
    @InjectRepository(Canton)
    private cantonRepo: Repository<Canton>,
  ) {}

  async getAllRegions(): Promise<Region[]> {
    return this.regionRepo.find({ order: { nom: 'ASC' } });
  }

  async getPrefecturesByRegion(regionId: number): Promise<Prefecture[]> {
    return this.prefectureRepo.find({
      where: { regionId },
      order: { nom: 'ASC' },
    });
  }

  async getCantonsByPrefecture(prefectureId: number): Promise<Canton[]> {
    return this.cantonRepo.find({
      where: { prefectureId },
      order: { nom: 'ASC' },
    });
  }

  async getCanton(id: number): Promise<Canton | null> {
    return this.cantonRepo.findOne({
      where: { id },
      relations: ['prefecture', 'prefecture.region'],
    });
  }

  async getAllCantons(): Promise<Canton[]> {
    return this.cantonRepo.find({
      relations: ['prefecture', 'prefecture.region'],
      order: { nom: 'ASC' },
    });
  }
}