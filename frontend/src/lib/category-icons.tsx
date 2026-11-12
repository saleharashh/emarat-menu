import {
  CakeSliceIcon,
  CoffeeIcon,
  CookieIcon,
  CroissantIcon,
  CupSodaIcon,
  IceCreamConeIcon,
  PizzaIcon,
  SaladIcon,
  SandwichIcon,
  SoupIcon,
  UtensilsCrossedIcon,
  WineIcon,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<
  string,
  { label: string; Icon: LucideIcon }
> = {
  coffee: { label: "قهوه و چای", Icon: CoffeeIcon },
  "cup-soda": { label: "نوشیدنی سرد", Icon: CupSodaIcon },
  "ice-cream": { label: "بستنی و فالوده", Icon: IceCreamConeIcon },
  cake: { label: "کیک و دسر", Icon: CakeSliceIcon },
  cookie: { label: "شیرینی", Icon: CookieIcon },
  croissant: { label: "نان و کروسان", Icon: CroissantIcon },
  sandwich: { label: "ساندویچ", Icon: SandwichIcon },
  pizza: { label: "پیتزا", Icon: PizzaIcon },
  salad: { label: "سالاد", Icon: SaladIcon },
  soup: { label: "آش و سوپ", Icon: SoupIcon },
  utensils: { label: "غذا و طعم سنتی", Icon: UtensilsCrossedIcon },
  wine: { label: "نوشیدنی خاص", Icon: WineIcon },
};

export function getCategoryIcon(key: string | null | undefined): LucideIcon | null {
  if (!key) return null;
  return CATEGORY_ICONS[key]?.Icon ?? null;
}
