import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(federationId: string, utilisateurId: string, dto: CreateOrderDto): Promise<Commande> {
    return this.dataSource.transaction(async (manager) => {
      // Get pack info
      const pack = await manager.findOne(Pack, { where: { id: dto.packId } });
      if (!pack) {
        throw new NotFoundException('Pack non trouvé');
      }

      // Check stock
      if (pack.stockDisponible < (dto.quantite || 1)) {
        throw new Error(`Stock insuffisant. Disponible: ${pack.stockDisponible}, Demandé: ${dto.quantite || 1}`);
      }

      // Create commande
      const commande = manager.create(Commande, {
        federationId,
        utilisateurId,
        montantTotal: pack.prixUnitaire * (dto.quantite || 1),
      });
      await manager.save(commande);

      // Create ligne
      const ligne = manager.create(CommandeLigne, {
        commandeId: commande.id,
        packId: pack.id,
        quantite: dto.quantite || 1,
        prixUnitaire: pack.prixUnitaire,
      });
      await manager.save(ligne);

      return this.findOne(commande.id);
    });
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
    return this.dataSource.transaction(async (manager) => {
      const commande = await this.findOne(id);
      commande.statut = CommandeStatut.CONFIRMEE;
      commande.transactionId = transactionId;
      commande.methodePaiement = method;
      commande.datePaiement = new Date();
      await manager.save(commande);

      // Decrement stock for each line
      for (const ligne of commande.lignes) {
        const result = await manager
          .createQueryBuilder()
          .update(Pack)
          .set({ 
            stockDisponible: () => `stock_disponible - ${ligne.quantite}`,
            nombreVentes: () => `nombre_ventes + ${ligne.quantite}`,
          })
          .where('id = :id', { id: ligne.packId })
          .andWhere('stock_disponible >= :qty', { qty: ligne.quantite })
          .execute();

        if (result.affected === 0) {
          throw new Error(`Stock insuffisant pour le pack ${ligne.packId}`);
        }
      }

      return commande;
    });
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