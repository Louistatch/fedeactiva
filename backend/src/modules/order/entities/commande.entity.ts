import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { Producteur } from '../../user/entities/producteur.entity';
import { Federation } from '../../federation/entities/federation.entity';
import { CommandeLigne } from './commande-ligne.entity';

export enum CommandeStatut {
  EN_ATTENTE = 'en_attente',
  CONFIRMEE = 'confirmee',
  ECHEC = 'echec',
  REMBOURSEE = 'remboursee',
}

@Entity('commandes')
export class Commande {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'utilisateur_id' })
  utilisateurId: string;

  @ManyToOne(() => Producteur)
  @JoinColumn({ name: 'utilisateur_id' })
  utilisateur: Producteur;

  @Column({ name: 'federation_id' })
  federationId: string;

  @ManyToOne(() => Federation)
  @JoinColumn({ name: 'federation_id' })
  federation: Federation;

  @Column()
  reference: string;

  @Column({ name: 'date_commande', default: () => 'NOW()' })
  dateCommande: Date;

  @Column({ type: 'enum', enum: CommandeStatut, default: CommandeStatut.EN_ATTENTE })
  statut: CommandeStatut;

  @Column({ name: 'montant_total', type: 'decimal', precision: 10, scale: 2 })
  montantTotal: number;

  @Column({ name: 'methode_paiement', nullable: true })
  methodePaiement: string;

  @Column({ name: 'reference_paiement', nullable: true })
  referencePaiement: string;

  @Column({ name: 'transaction_id', nullable: true })
  transactionId: string;

  @Column({ name: 'date_paiement', nullable: true })
  datePaiement: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CommandeLigne, (ligne) => ligne.commande)
  lignes: CommandeLigne[];
}