import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Culture } from './entities/culture.entity';
import { CreateCultureDto } from './dto/create-culture.dto';

@Injectable()
export class CultureService {
  constructor(
    @InjectRepository(Culture)
    private cultureRepo: Repository<Culture>,
  ) {}

  async create(federationId: string, dto: CreateCultureDto): Promise<Culture> {
    const culture = this.cultureRepo.create({
      ...dto,
      federationId,
    });
    return this.cultureRepo.save(culture);
  }

  async findAllByFederation(federationId: string): Promise<Culture[]> {
    return this.cultureRepo.find({
      where: { federationId, active: true },
      order: { nom: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Culture | null> {
    return this.cultureRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: Partial<CreateCultureDto>): Promise<Culture> {
    const culture = await this.findOne(id);
    if (!culture) {
      throw new Error('Culture not found');
    }
    Object.assign(culture, dto);
    return this.cultureRepo.save(culture);
  }

  async remove(id: string): Promise<void> {
    await this.cultureRepo.delete(id);
  }
}