import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsString()
  nameEn?: string | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsString()
  description?: string | null;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  price: number;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsString()
  imageUrl?: string | null;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsInt()
  sort?: number;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? null : Number(value)))
  @IsInt()
  categoryId?: number | null;
}

export class UpdateMenuItemDto extends CreateMenuItemDto {}
