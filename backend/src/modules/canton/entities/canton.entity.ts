import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Prefecture } from './prefecture.entity';

@Entity('cantons')
export class Canton {
  @PrimaryColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ nullable: true })
  code: string;

  @Column({ name: 'prefecture_id' })
  prefectureId: number;

  @ManyToOne(() => Prefecture, (prefecture) => prefecture.cantons)
  @JoinColumn({ name: 'prefecture_id' })
  prefecture: Prefecture;

  @Column({ type: 'geometry', nullable: true })
  geom: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}