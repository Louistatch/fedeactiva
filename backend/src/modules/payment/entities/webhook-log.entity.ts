import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

@Entity('webhook_logs')
export class WebhookLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'federation_id', nullable: true })
  federationId: string;

  @Column()
  provider: string;

  @Column({ name: 'event_type', nullable: true })
  eventType: string;

  @Column({ type: 'jsonb' })
  payload: any;

  @Column({ nullable: true })
  signature: string;

  @Column({ name: 'ip_adresse', nullable: true })
  ipAdresse: string;

  @Column({ default: 'recus' })
  statut: string;

  @Column({ name: 'message_erreur', nullable: true })
  messageErreur: string;

  @Column({ name: 'traite_le', nullable: true })
  traiteLe: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}