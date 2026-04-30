import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Region } from './region.entity';
import { Canton } from './canton.entity';

@Entity('prefectures')
export class Prefecture {
  @PrimaryColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ nullable: true })
  code: string;

  @Column({ name: 'region_id' })
  regionId: number;

  @ManyToOne(() => Region, (region) => region.prefectures)
  @JoinColumn({ name: 'region_id' })
  region: Region;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Canton, (canton) => canton.prefecture)
  cantons: Canton[];
}