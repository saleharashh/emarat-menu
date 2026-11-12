import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('site_settings')
export class SiteSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  heroImageUrl: string | null;

  @Column({ type: 'int', default: 10 })
  taxPercent: number;
}
