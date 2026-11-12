export interface Category {
  id: number;
  name: string;
  nameEn?: string | null;
  icon: string | null;
  imageUrl?: string | null;
  parentId?: number | null;
  sort: number;
}

export interface MenuItem {
  id: number;
  name: string;
  nameEn?: string | null;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured?: boolean;
  sort: number;
  categoryId: number | null;
  category?: Category | null;
}

export interface SiteSettings {
  id: number;
  heroImageUrl: string | null;
  taxPercent?: number;
}
