import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Producteur } from './entities/producteur.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Producteur)
    private producteurRepo: Repository<Producteur>,
  ) {}

  async findById(id: string): Promise<Producteur> {
    const user = await this.producteurRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }

  async findByTelephone(telephone: string, federationId: string): Promise<Producteur | null> {
    return this.producteurRepo.findOne({
      where: { telephone, federationId },
    });
  }

  async findByFederation(federationId: string): Promise<Producteur[]> {
    return this.producteurRepo.find({
      where: { federationId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(federationId: string, data: {
    nom: string;
    prenom: string;
    telephone: string;
    email?: string;
    password: string;
  }): Promise<Producteur> {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const producteur = this.producteurRepo.create({
      federationId,
      nom: data.nom.toUpperCase(),
      prenom: data.prenom,
      telephone: data.telephone,
      email: data.email,
      motDePasseHash: hashedPassword,
    });
    return this.producteurRepo.save(producteur);
  }

  async update(id: string, data: Partial<{
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
  }>): Promise<Producteur> {
    const user = await this.findById(id);
    Object.assign(user, data);
    return this.producteurRepo.save(user);
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.findById(id);
    const isValid = await bcrypt.compare(currentPassword, user.motDePasseHash);
    if (!isValid) {
      throw new Error('Mot de passe actuel incorrect');
    }
    user.motDePasseHash = await bcrypt.hash(newPassword, 12);
    await this.producteurRepo.save(user);
  }
}