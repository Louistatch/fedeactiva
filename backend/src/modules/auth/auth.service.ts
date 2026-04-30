import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SuperAdmin } from './entities/super-admin.entity';
import { AdminFederation } from './entities/admin-federation.entity';
import { Producteur } from '../user/entities/producteur.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  role: 'super_admin' | 'admin_federation' | 'producteur';
  federationId?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email?: string;
    telephone?: string;
    nom: string;
    prenom: string;
    role: string;
    federationId?: string;
    federationSlug?: string;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(SuperAdmin)
    private superAdminRepo: Repository<SuperAdmin>,
    @InjectRepository(AdminFederation)
    private adminFedRepo: Repository<AdminFederation>,
    @InjectRepository(Producteur)
    private producteurRepo: Repository<Producteur>,
    private jwtService: JwtService,
  ) {}

  /**
   * Méthode de login unifiée qui détecte automatiquement le type d'utilisateur
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    // 1. Essayer Super Admin (email)
    try {
      const superAdmin = await this.superAdminRepo.findOne({
        where: { email: dto.email, actif: true },
      });

      if (superAdmin) {
        const isValid = await bcrypt.compare(dto.password, superAdmin.motDePasseHash);
        if (isValid) {
          await this.superAdminRepo.update(superAdmin.id, { lastLogin: new Date() });

          const payload: JwtPayload = {
            sub: superAdmin.id,
            email: superAdmin.email,
            role: 'super_admin',
          };

          return {
            accessToken: this.jwtService.sign(payload),
            user: {
              id: superAdmin.id,
              email: superAdmin.email,
              nom: superAdmin.nom || '',
              prenom: superAdmin.prenom || '',
              role: 'super_admin',
            },
          };
        }
      }
    } catch (error) {
      this.logger.debug('Not a super admin');
    }

    // 2. Essayer Admin Fédération (email)
    try {
      const adminFed = await this.adminFedRepo
        .createQueryBuilder('admin')
        .leftJoinAndSelect('admin.federation', 'fed')
        .where('admin.email = :email', { email: dto.email })
        .andWhere('admin.actif = :actif', { actif: true })
        .andWhere('fed.active = :active', { active: true })
        .getOne();

      if (adminFed) {
        const isValid = await bcrypt.compare(dto.password, adminFed.motDePasseHash);
        if (isValid) {
          await this.adminFedRepo.update(adminFed.id, { lastLogin: new Date() });

          const payload: JwtPayload = {
            sub: adminFed.id,
            email: adminFed.email,
            role: 'admin_federation',
            federationId: adminFed.federationId,
          };

          return {
            accessToken: this.jwtService.sign(payload),
            user: {
              id: adminFed.id,
              email: adminFed.email,
              nom: adminFed.nom || '',
              prenom: adminFed.prenom || '',
              role: 'admin_federation',
              federationId: adminFed.federationId,
              federationSlug: adminFed.federation?.slug,
            },
          };
        }
      }
    } catch (error) {
      this.logger.debug('Not an admin federation');
    }

    // 3. Essayer Producteur (téléphone)
    try {
      const producteur = await this.producteurRepo.findOne({
        where: { telephone: dto.email, actif: true },
      });

      if (producteur) {
        const isValid = await bcrypt.compare(dto.password, producteur.motDePasseHash);
        if (isValid) {
          await this.producteurRepo.update(producteur.id, { lastLogin: new Date() });

          const payload: JwtPayload = {
            sub: producteur.id,
            email: producteur.telephone,
            role: 'producteur',
            federationId: producteur.federationId,
          };

          return {
            accessToken: this.jwtService.sign(payload),
            user: {
              id: producteur.id,
              telephone: producteur.telephone,
              nom: producteur.nom,
              prenom: producteur.prenom,
              role: 'producteur',
              federationId: producteur.federationId,
            },
          };
        }
      }
    } catch (error) {
      this.logger.debug('Not a producteur');
    }

    throw new UnauthorizedException('Identifiants invalides');
  }

  async loginSuperAdmin(dto: LoginDto): Promise<AuthResponse> {
    const admin = await this.superAdminRepo.findOne({
      where: { email: dto.email, actif: true },
    });

    if (!admin) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isValid = await bcrypt.compare(dto.password, admin.motDePasseHash);
    if (!isValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Update last login
    await this.superAdminRepo.update(admin.id, { lastLogin: new Date() });

    const payload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      role: 'super_admin',
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: admin.id,
        email: admin.email,
        nom: admin.nom || '',
        prenom: admin.prenom || '',
        role: 'super_admin',
      },
    };
  }

  async loginAdminFederation(
    slug: string,
    dto: LoginDto,
  ): Promise<AuthResponse> {
    const admin = await this.adminFedRepo
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.federation', 'fed')
      .where('admin.email = :email', { email: dto.email })
      .andWhere('fed.slug = :slug', { slug })
      .andWhere('admin.actif = :actif', { actif: true })
      .andWhere('fed.active = :active', { active: true })
      .getOne();

    if (!admin) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isValid = await bcrypt.compare(dto.password, admin.motDePasseHash);
    if (!isValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    await this.adminFedRepo.update(admin.id, { lastLogin: new Date() });

    const payload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      role: 'admin_federation',
      federationId: admin.federationId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: admin.id,
        email: admin.email,
        nom: admin.nom || '',
        prenom: admin.prenom || '',
        role: 'admin_federation',
        federationId: admin.federationId,
        federationSlug: slug,
      },
    };
  }

  async loginProducteur(
    federationId: string,
    dto: LoginDto,
  ): Promise<AuthResponse> {
    const producteur = await this.producteurRepo.findOne({
      where: { telephone: dto.email, federationId, actif: true },
    });

    if (!producteur) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isValid = await bcrypt.compare(dto.password, producteur.motDePasseHash);
    if (!isValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    await this.producteurRepo.update(producteur.id, { lastLogin: new Date() });

    const payload: JwtPayload = {
      sub: producteur.id,
      email: producteur.telephone,
      role: 'producteur',
      federationId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: producteur.id,
        telephone: producteur.telephone,
        nom: producteur.nom,
        prenom: producteur.prenom,
        role: 'producteur',
        federationId,
      },
    };
  }

  async registerProducteur(
    federationId: string,
    dto: RegisterDto,
  ): Promise<AuthResponse> {
    // Check if already exists
    const exists = await this.producteurRepo.findOne({
      where: { telephone: dto.telephone, federationId },
    });

    if (exists) {
      throw new UnauthorizedException('Ce numéro est déjà enregistré');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const producteur = this.producteurRepo.create({
      federationId,
      nom: dto.nom.toUpperCase(),
      prenom: dto.prenom,
      telephone: dto.telephone,
      email: dto.email,
      motDePasseHash: hashedPassword,
    });

    await this.producteurRepo.save(producteur);

    const payload: JwtPayload = {
      sub: producteur.id,
      email: producteur.telephone,
      role: 'producteur',
      federationId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: producteur.id,
        telephone: producteur.telephone,
        nom: producteur.nom,
        prenom: producteur.prenom,
        role: 'producteur',
        federationId,
      },
    };
  }

  async validateJwt(payload: JwtPayload) {
    if (payload.role === 'super_admin') {
      return this.superAdminRepo.findOne({ where: { id: payload.sub } });
    }
    if (payload.role === 'admin_federation') {
      return this.adminFedRepo.findOne({ where: { id: payload.sub } });
    }
    if (payload.role === 'producteur') {
      return this.producteurRepo.findOne({ where: { id: payload.sub } });
    }
    return null;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
}
