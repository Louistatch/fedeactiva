import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Commande } from './commande.entity';
import { Pack } from '../../pack/entities/pack.entity';

@Entity('commandes_lignes')
export class CommandeLigne {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'commande_id' })
  commandeId: string;

  @ManyToOne(() => Commande, (commande) => commande.lignes)
  @JoinColumn({ name: 'commande_id' })
  commande: Commande;

  @Column({ name: 'pack_id' })
  packId: string;

  @ManyToOne(() => Pack)
  @JoinColumn({ name: 'pack_id' })
  pack: Pack;

  @Column({ default: 1 })
  quantite: number;

  @Column({ name: 'prix_unitaire', type: 'decimal', precision: 10, scale: 2 })
  prixUnitaire: number;

  @Column({ name: 'fichier_excel_genere_path', nullable: true })
  fichierExcelGenerePath: string;

  @Column({ name: 'fichier_excel_genere_nom', nullable: true })
  fichierExcelGenereNom: string;

  @Column({ name: 'fichier_word_genere_path', nullable: true })
  fichierWordGenerePath: string;

  @Column({ name: 'fichier_word_genere_nom', nullable: true })
  fichierWordGenereNom: string;

  @Column({ name: 'fichier_excel_size', nullable: true })
  fichierExcelSize: number;

  @Column({ name: 'fichier_word_size', nullable: true })
  fichierWordSize: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}