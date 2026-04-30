import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn,
  ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { Federation } from '../../federation/entities/federation.entity';
import { Culture } from '../../culture/entities/culture.entity';
import { ModeleDocument } from '../../document/entities/modele-document.entity';

export enum PackStatut {
  BROUILLON = 'brouillon',
  PUBLIE = 'publie',
  EPUISE = 'epuise',
  ARCHIVE = 'archive',
}

@Entity('packs')
export class Pack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'federation_id' })
  federationId: string;

  @ManyToOne(() => Federation)
  @JoinColumn({ name: 'federation_id' })
  federation: Federation;

  @Column({ name: 'culture_id' })
  cultureId: string;

  @ManyToOne(() => Culture)
  @JoinColumn({ name: 'culture_id' })
  culture: Culture;

  @Column({ name: 'canton_id' })
  cantonId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 500 })
  prixUnitaire: number;

  @Column({ name: 'stock_total', default: 999999 })
  stockTotal: number;

  @Column({ name: 'stock_disponible', default: 999999 })
  stockDisponible: number;

  @Column({ name: 'date_debut_validite', nullable: true })
  dateDebutValidite: Date;

  @Column({ name: 'date_fin_validite', nullable: true })
  dateFinValidite: Date;

  @Column({ nullable: true })
  campagne: string;

  @Column({ name: 'rendement_estime', type: 'decimal', precision: 10, scale: 2, nullable: true })
  rendementEstime: number;

  @Column({ type: 'enum', enum: PackStatut, default: PackStatut.BROUILLON })
  statut: PackStatut;

  @Column({ name: 'modele_excel_id', nullable: true })
  modeleExcelId: string;

  @Column({ name: 'modele_word_id', nullable: true })
  modeleWordId: string;

  @ManyToOne(() => ModeleDocument)
  @JoinColumn({ name: 'modele_excel_id' })
  modeleExcel: ModeleDocument;

  @ManyToOne(() => ModeleDocument)
  @JoinColumn({ name: 'modele_word_id' })
  modeleWord: ModeleDocument;

  @Column({ name: 'nombre_ventes', default: 0 })
  nombreVentes: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}