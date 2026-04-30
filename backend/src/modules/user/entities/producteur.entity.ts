import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Federation } from '../../federation/entities/federation.entity';

@Entity('producteurs')
export class Producteur {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'federation_id' })
  federationId: string;

  @ManyToOne(() => Federation)
  @JoinColumn({ name: 'federation_id' })
  federation: Federation;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  telephone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'mot_de_passe_hash' })
  motDePasseHash: string;

  @Column({ default: true })
  actif: boolean;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}
