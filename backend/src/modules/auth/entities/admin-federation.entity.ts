import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Federation } from '../../federation/entities/federation.entity';

@Entity('admin_federations')
export class AdminFederation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'federation_id' })
  federationId: string;

  @ManyToOne(() => Federation)
  @JoinColumn({ name: 'federation_id' })
  federation: Federation;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'mot_de_passe_hash' })
  motDePasseHash: string;

  @Column({ nullable: true })
  nom: string;

  @Column({ nullable: true })
  prenom: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ default: true })
  actif: boolean;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}
