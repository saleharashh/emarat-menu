import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AppModule } from './app.module';
import { User } from './auth/user.entity';
import { Category } from './categories/category.entity';
import { MenuItem } from './menu-items/menu-item.entity';
import { SiteSettings } from './settings/site-settings.entity';
import { DEFAULT_HERO_IMAGE } from './settings/settings.service';

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

const CATEGORY_ICONS: Record<string, string> = {
  'نوشیدنی‌های گرم': 'coffee',
  'نوشیدنی‌های سرد': 'cup-soda',
  'دسر و شیرینی': 'cake',
  'طعم‌های سنتی یزد': 'utensils',
};

const CATEGORY_META: Record<string, { nameEn: string; imageUrl: string }> = {
  'نوشیدنی‌های گرم': {
    nameEn: 'Hot Drinks',
    imageUrl: img('photo-1509042239860-f550ce710b93'),
  },
  'نوشیدنی‌های سرد': {
    nameEn: 'Cold Drinks',
    imageUrl: img('photo-1517701604599-bb29b565090c'),
  },
  'دسر و شیرینی': {
    nameEn: 'Desserts & Pastries',
    imageUrl: img('photo-1509365465985-25d11c17e812'),
  },
  'طعم‌های سنتی یزد': {
    nameEn: 'Traditional Yazd',
    imageUrl: img('photo-1621263764928-df1444c5e859'),
  },
};

const FEATURED_ITEMS = new Set([
  'چای زعفرانی',
  'شربت سکنجبین',
  'باقلوا',
  'فالوده یزدی',
]);

const ITEM_IMAGES: Record<string, string> = {
  'چای زعفرانی': img('photo-1544787219-7f47ccb76574'),
  'قهوه ترک': img('photo-1447933601403-0c6688de566e'),
  'اسپرسو': img('photo-1509042239860-f550ce710b93'),
  'کاپوچینو': img('photo-1461023058943-07fcbe16d735'),
  'هات‌چاکلت یزدی': img('photo-1542990253-0d0f5be5f0ed'),
  'شربت سکنجبین': img('photo-1499638673689-79a0b5115d87'),
  'شربت بیدمشک': img('photo-1544145945-f90425340c7e'),
  'لیموناد نعنا': img('photo-1556881286-fc6915169721'),
  'آیس‌لته': img('photo-1517701604599-bb29b565090c'),
  'باقلوا': img('photo-1509365465985-25d11c17e812'),
  'کیک یزدی': img('photo-1464349095431-e9a21285b5f3'),
  'قطاب': img('photo-1495474472287-4d71bcdd2085'),
  'پشمک سنتی': img('photo-1551024506-0bccd828d307'),
  'فالوده یزدی': img('photo-1621263764928-df1444c5e859'),
  'شله‌زرد': img('photo-1488477181946-6428a0291777'),
  'آش شولی یزدی': img('photo-1547592166-23ac45744acd'),
};

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const ds = app.get(DataSource);

  const users = ds.getRepository(User);
  const categories = ds.getRepository(Category);
  const items = ds.getRepository(MenuItem);
  const settings = ds.getRepository(SiteSettings);

  const username = process.env.ADMIN_USERNAME ?? 'admin';
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error('ADMIN_PASSWORD is required in .env for seeding');
  }
  const existing = await users.findOne({ where: { username } });
  if (!existing) {
    await users.save(
      users.create({ username, passwordHash: await bcrypt.hash(password, 10) }),
    );
    console.log(`Admin user "${username}" created`);
  } else {
    console.log(`Admin user "${username}" already exists`);
  }

  if ((await categories.count()) === 0) {
    const hot = await categories.save(categories.create({ name: 'نوشیدنی‌های گرم', sort: 1 }));
    const cold = await categories.save(categories.create({ name: 'نوشیدنی‌های سرد', sort: 2 }));
    const dessert = await categories.save(categories.create({ name: 'دسر و شیرینی', sort: 3 }));
    const traditional = await categories.save(categories.create({ name: 'طعم‌های سنتی یزد', sort: 4 }));

    await items.save([
      items.create({ name: 'چای زعفرانی', description: 'چای دم‌کشیده با زعفران و هل، سرو شده با نبات', price: 85000, categoryId: hot.id, sort: 1 }),
      items.create({ name: 'قهوه ترک', description: 'قهوه اصیل ترک با دانه تازه آسیاب‌شده', price: 120000, categoryId: hot.id, sort: 2 }),
      items.create({ name: 'اسپرسو', description: 'شات اسپرسو با کرِمای غلیظ', price: 110000, categoryId: hot.id, sort: 3 }),
      items.create({ name: 'کاپوچینو', description: 'اسپرسو با شیر بخارداده و فوم نرم', price: 145000, categoryId: hot.id, sort: 4 }),
      items.create({ name: 'هات‌چاکلت یزدی', description: 'شکلات داغ غلیظ با طعم گلاب', price: 150000, categoryId: hot.id, sort: 5 }),
      items.create({ name: 'شربت سکنجبین', description: 'سکنجبین خانگی با خیار و نعنا', price: 95000, categoryId: cold.id, sort: 1 }),
      items.create({ name: 'شربت بیدمشک', description: 'بیدمشک خالص با گلاب و یخ', price: 90000, categoryId: cold.id, sort: 2 }),
      items.create({ name: 'لیموناد نعنا', description: 'لیموی تازه با نعنا و کمی عسل', price: 105000, categoryId: cold.id, sort: 3 }),
      items.create({ name: 'آیس‌لته', description: 'اسپرسو روی شیر سرد و یخ', price: 155000, categoryId: cold.id, sort: 4 }),
      items.create({ name: 'باقلوا', description: 'باقلوای خانگی با مغز پسته و بادام', price: 130000, categoryId: dessert.id, sort: 1 }),
      items.create({ name: 'کیک یزدی', description: 'کیک سنتی یزد با گلاب و هل', price: 75000, categoryId: dessert.id, sort: 2 }),
      items.create({ name: 'قطاب', description: 'قطاب تازه با مغز بادام و پودر قند', price: 85000, categoryId: dessert.id, sort: 3 }),
      items.create({ name: 'پشمک سنتی', description: 'پشمک دست‌ساز یزدی با چای', price: 65000, categoryId: dessert.id, sort: 4 }),
      items.create({ name: 'فالوده یزدی', description: 'فالوده سنتی با آبلیمو و خلال پسته', price: 115000, categoryId: traditional.id, sort: 1 }),
      items.create({ name: 'شله‌زرد', description: 'شله‌زرد زعفرانی با دارچین و خلال بادام', price: 95000, categoryId: traditional.id, sort: 2 }),
      items.create({ name: 'آش شولی یزدی', description: 'آش سنتی یزد با سرکه و نعنا', price: 140000, categoryId: traditional.id, sort: 3 }),
    ]);
    console.log('Sample menu data seeded');
  } else {
    console.log('Categories already seeded, skipping sample data');
  }

  // Idempotent: attach icons and cover metadata to known categories
  for (const [name, icon] of Object.entries(CATEGORY_ICONS)) {
    const category = await categories.findOne({ where: { name } });
    if (!category) continue;
    let changed = false;
    if (category.icon !== icon) {
      category.icon = icon;
      changed = true;
    }
    const meta = CATEGORY_META[name];
    if (meta) {
      if (!category.nameEn) {
        category.nameEn = meta.nameEn;
        changed = true;
      }
      if (!category.imageUrl) {
        category.imageUrl = meta.imageUrl;
        changed = true;
      }
    }
    if (changed) await categories.save(category);
  }

  const hasFeatured = (await items.count({ where: { isFeatured: true } })) > 0;

  // Idempotent: attach Unsplash mock images to known items without a local upload
  for (const [name, imageUrl] of Object.entries(ITEM_IMAGES)) {
    const item = await items.findOne({ where: { name } });
    if (!item) continue;
    let changed = false;
    if (!item.imageUrl || item.imageUrl.includes('images.unsplash.com')) {
      item.imageUrl = imageUrl;
      changed = true;
    }
    if (!hasFeatured && FEATURED_ITEMS.has(name)) {
      item.isFeatured = true;
      changed = true;
    }
    if (changed) await items.save(item);
  }

  if ((await settings.count()) === 0) {
    await settings.save(settings.create({ heroImageUrl: DEFAULT_HERO_IMAGE }));
    console.log('Default hero image set');
  }

  console.log('Seed complete');
  await app.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
