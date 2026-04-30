import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'federation_id', nullable: true })
  federationId: string;

  @Column({ name: 'utilisateur_type', nullable: true })
  utilisateurType: 'super_admin' | 'admin_fed' | 'producteur';

  @Column()
  action: string;

  @Column({ name: 'ressource_type', nullable: true })
  ressourceType: string;

  @Column({ name: 'ressource_id', nullable: true })
  ressourceId: string;

  @Column({ type: 'jsonb', default: '{}' })
  metadata: Record<string, any>;

  @Column({ name: 'adresse_ip', nullable: true })
  adresseIp: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}