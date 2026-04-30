import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Federation } from '../../federation/entities/federation.entity';

@Entity('cultures')
export class Culture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'federation_id' })
  federationId: string;

  @ManyToOne(() => Federation, (fed) => fed.cultures)
  @JoinColumn({ name: 'federation_id' })
  federation: Federation;

  @Column()
  nom: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: '🌱' })
  icone: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}