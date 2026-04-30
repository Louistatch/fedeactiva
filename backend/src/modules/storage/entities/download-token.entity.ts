import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { CommandeLigne } from '../../order/entities/commande-ligne.entity';

@Entity('download_tokens')
export class DownloadToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ligne_commande_id' })
  ligneCommandeId: string;

  @ManyToOne(() => CommandeLigne)
  @JoinColumn({ name: 'ligne_commande_id' })
  ligneCommande: CommandeLigne;

  @Column()
  token: string;

  @Column({ name: 'type_fichier' })
  typeFichier: 'excel' | 'word';

  @Column({ name: 'expire_at' })
  expireAt: Date;

  @Column({ name: 'telechargements_count', default: 0 })
  telechargementsCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}