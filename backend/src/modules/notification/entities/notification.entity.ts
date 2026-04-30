import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'utilisateur_id' })
  utilisateurId: string;

  @Column({ name: 'federation_id' })
  federationId: string;

  @Column()
  type: 'sms' | 'email' | 'both';

  @Column()
  destinataire: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: 'en_attente' })
  statut: 'en_attente' | 'envoye' | 'echoue';

  @Column({ nullable: true })
  fournisseur: string;

  @Column({ name: 'reference_externe', nullable: true })
  referenceExterne: string;

  @Column({ nullable: true })
  erreur: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'envoye_le', nullable: true })
  envoyeLe: Date;
}