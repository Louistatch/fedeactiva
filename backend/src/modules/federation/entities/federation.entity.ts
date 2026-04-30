import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Culture } from '../../culture/entities/culture.entity';

@Entity('federations')
export class Federation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string;

  @Column({ name: 'couleur_primaire', default: '#1c4a2e' })
  couleurPrimaire: string;

  @Column({ name: 'couleur_secondaire', default: '#52b788' })
  couleurSecondaire: string;

  @Column({ name: 'api_key', unique: true })
  apiKey: string;

  @Column({ default: false })
  active: boolean;

  @Column({ name: 'commission_percent', type: 'decimal', precision: 5, scale: 2, default: 10.00 })
  commissionPercent: number;

  @Column({ name: 'domaines_autorises', type: 'text', array: true, default: '{}' })
  domainesAutorises: string[];

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => Culture, (culture) => culture.federation)
  cultures: Culture[];
}
