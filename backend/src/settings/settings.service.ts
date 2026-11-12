import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSettings } from './site-settings.entity';

export const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&q=80&auto=format&fit=crop';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SiteSettings)
    private readonly repo: Repository<SiteSettings>,
  ) {}

  async get(): Promise<SiteSettings> {
    let settings = await this.repo.findOne({ where: {} });
    if (!settings) {
      settings = await this.repo.save(
        this.repo.create({ heroImageUrl: DEFAULT_HERO_IMAGE, taxPercent: 10 }),
      );
    }
    return settings;
  }

  async update(dto: {
    heroImageUrl?: string | null;
    taxPercent?: number;
  }): Promise<SiteSettings> {
    const settings = await this.get();
    if (dto.heroImageUrl !== undefined) {
      settings.heroImageUrl = dto.heroImageUrl;
    }
    if (dto.taxPercent !== undefined) {
      settings.taxPercent = dto.taxPercent;
    }
    return this.repo.save(settings);
  }
}
