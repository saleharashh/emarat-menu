import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateMenuItemDto } from './dto/menu-item.dto';
import { MenuItem } from './menu-item.entity';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem) private readonly repo: Repository<MenuItem>,
  ) {}

  findAll(categoryId?: number) {
    const where: FindOptionsWhere<MenuItem> = {};
    if (categoryId) where.categoryId = categoryId;
    return this.repo.find({
      where,
      relations: { category: true },
      order: { sort: 'ASC', id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!item) throw new NotFoundException('آیتم یافت نشد');
    return item;
  }

  create(dto: CreateMenuItemDto) {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: CreateMenuItemDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repo.remove(item);
  }
}
