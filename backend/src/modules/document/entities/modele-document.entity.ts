import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Federation } from '../../federation/entities/federation.entity';
import { Culture } from '../../culture/entities/culture.entity';

@Entity('modeles_documents')
export class ModeleDocument {
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

  @Column({ name: 'canton_id', nullable: true })
  cantonId: number;

  @Column({ name: 'type_document' })
  typeDocument: 'excel' | 'word';

  @Column({ name: 'fichier_nom' })
  fichierNom: string;

  @Column({ name: 'fichier_path' })
  fichierPath: string;

  @Column({ name: 'fichier_size', nullable: true })
  fichierSize: number;

  @Column({ default: 1 })
  version: number;

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}