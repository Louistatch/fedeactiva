import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { DownloadToken } from './entities/download-token.entity';
import { CommandeLigne } from '../order/entities/commande-ligne.entity';

@Injectable()
export class DownloadService {
  private readonly generatedDir = process.env.STORAGE_PATH || './uploads/generated';
  private readonly tokenValidityMinutes = 15;

  constructor(
    @InjectRepository(DownloadToken)
    private tokenRepo: Repository<DownloadToken>,
    @InjectRepository(CommandeLigne)
    private ligneRepo: Repository<CommandeLigne>,
  ) {}

  async generateToken(ligneCommandeId: string, typeFichier: 'excel' | 'word'): Promise<{
    token: string;
    url: string;
    expireAt: Date;
  }> {
    const ligne = await this.ligneRepo.findOne({
      where: { id: ligneCommandeId },
      relations: ['commande'],
    });

    if (!ligne) {
      throw new NotFoundException('Ligne de commande non trouvée');
    }

    // Check if file exists
    const filePath = typeFichier === 'excel' 
      ? ligne.fichierExcelGenerePath 
      : ligne.fichierWordGenerePath;

    if (!filePath || !fs.existsSync(filePath)) {
      throw new BadRequestException('Fichier non disponible');
    }

    // Delete existing tokens for this ligne and type
    await this.tokenRepo.delete({ ligneCommandeId, typeFichier });

    // Create new token
    const token = uuidv4().replace(/-/g, '');
    const expireAt = new Date(Date.now() + this.tokenValidityMinutes * 60 * 1000);

    const downloadToken = this.tokenRepo.create({
      ligneCommandeId,
      token,
      typeFichier,
      expireAt,
    });

    await this.tokenRepo.save(downloadToken);

    return {
      token,
      url: `/api/v1/download/${token}`,
      expireAt,
    };
  }

  async getFileByToken(token: string): Promise<{
    stream: fs.ReadStream;
    filename: string;
    mimeType: string;
  }> {
    const downloadToken = await this.tokenRepo.findOne({
      where: { token },
      relations: ['ligneCommande'],
    });

    if (!downloadToken) {
      throw new NotFoundException('Token invalide');
    }

    if (new Date() > downloadToken.expireAt) {
      throw new BadRequestException('Token expiré');
    }

    const filePath = downloadToken.typeFichier === 'excel'
      ? downloadToken.ligneCommande.fichierExcelGenerePath
      : downloadToken.ligneCommande.fichierWordGenerePath;

    const filename = downloadToken.typeFichier === 'excel'
      ? downloadToken.ligneCommande.fichierExcelGenereNom
      : downloadToken.ligneCommande.fichierWordGenereNom;

    const mimeType = downloadToken.typeFichier === 'excel'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    // Increment download count
    downloadToken.telechargementsCount += 1;
    await this.tokenRepo.save(downloadToken);

    return {
      stream: fs.createReadStream(filePath),
      filename,
      mimeType,
    };
  }

  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.tokenRepo.delete({
      expireAt: new Date(),
    });
    return result.affected || 0;
  }
}