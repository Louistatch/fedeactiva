import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commande, CommandeStatut } from './entities/commande.entity';
import { CommandeLigne } from './entities/commande-ligne.entity';
import { Pack } from '../pack/entities/pack.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Commande)
    private commandeRepo: Repository<Commande>,
    @InjectRepository(CommandeLigne)
    private ligneRepo: Repository<CommandeLigne>,
    @InjectRepository(Pack)
    private packRepo: Repository<Pack>,
  ) {}

  async create(federationId: string, utilisateurId: string, dto: CreateOrderDto): Promise<Commande> {
    // Get pack info
    const pack = await this.packRepo.findOne({ where: { id: dto.packId } });
    if (!pack) {
      throw new NotFoundException('Pack non trouvé');
    }

    // Create commande
    const commande = this.commandeRepo.create({
      federationId,
      utilisateurId,
      montantTotal: pack.prixUnitaire * (dto.quantite || 1),
    });
    await this.commandeRepo.save(commande);

    // Create ligne
    const ligne = this.ligneRepo.create({
      commandeId: commande.id,
      packId: pack.id,
      quantite: dto.quantite || 1,
      prixUnitaire: pack.prixUnitaire,
    });
    await this.ligneRepo.save(ligne);

    return this.findOne(commande.id);
  }

  async findOne(id: string): Promise<Commande> {
    const commande = await this.commandeRepo.findOne({
      where: { id },
      relations: ['lignes', 'lignes.pack', 'utilisateur'],
    });
    if (!commande) {
      throw new NotFoundException(`Commande ${id} non trouvée`);
    }
    return commande;
  }

  async findByReference(reference: string): Promise<Commande | null> {
    return this.commandeRepo.findOne({
      where: { reference },
      relations: ['lignes', 'lignes.pack'],
    });
  }

  async findByUtilisateur(utilisateurId: string): Promise<Commande[]> {
    return this.commandeRepo.find({
      where: { utilisateurId, statut: CommandeStatut.CONFIRMEE },
      relations: ['lignes', 'lignes.pack', 'lignes.pack.culture'],
      order: { dateCommande: 'DESC' },
    });
  }

  async findByFederation(federationId: string): Promise<Commande[]> {
    return this.commandeRepo.find({
      where: { federationId },
      relations: ['lignes', 'lignes.pack', 'lignes.pack.culture', 'utilisateur'],
      order: { dateCommande: 'DESC' },
    });
  }

  async confirm(id: string, transactionId: string, method: string): Promise<Commande> {
    const commande = await this.findOne(id);
    commande.statut = CommandeStatut.CONFIRMEE;
    commande.transactionId = transactionId;
    commande.methodePaiement = method;
    commande.datePaiement = new Date();
    await this.commandeRepo.save(commande);

    // Decrement stock
    for (const ligne of commande.lignes) {
      await this.packRepo
        .createQueryBuilder()
        .update()
        .set({ 
          stockDisponible: () => 'stock_disponible - 1',
          nombreVentes: () => 'nombre_ventes + 1',
        })
        .where('id = :id', { id: ligne.packId })
        .execute();
    }

    return commande;
  }

  async fail(id: string): Promise<Commande> {
    const commande = await this.findOne(id);
    commande.statut = CommandeStatut.ECHEC;
    return this.commandeRepo.save(commande);
  }

  async updateLigneFiles(
    ligneId: string,
    excelPath: string,
    excelNom: string,
    wordPath: string,
    wordNom: string,
  ): Promise<void> {
    await this.ligneRepo.update(ligneId, {
      fichierExcelGenerePath: excelPath,
      fichierExcelGenereNom: excelNom,
      fichierWordGenerePath: wordPath,
      fichierWordGenereNom: wordNom,
    });
  }
}