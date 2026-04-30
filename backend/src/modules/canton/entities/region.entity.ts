import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Prefecture } from './prefecture.entity';

@Entity('regions')
export class Region {
  @PrimaryColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ nullable: true })
  code: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Prefecture, (prefecture) => prefecture.region)
  prefectures: Prefecture[];
}