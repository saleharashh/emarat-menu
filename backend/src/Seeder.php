<?php

require_once __DIR__ . '/Env.php';
require_once __DIR__ . '/Database.php';

class Seeder {
    private static function img(string $id, int $w = 800): string {
        return "https://images.unsplash.com/{$id}?w={$w}&q=80&auto=format&fit=crop";
    }

    public static function run(PDO $pdo, bool $force = false): void {
        $username = Env::get('ADMIN_USERNAME', 'admin');
        $password = Env::get('ADMIN_PASSWORD', 'Emarat@99a1d0');

        // Check if admin user exists
        $stmt = $pdo->prepare('SELECT COUNT(*) FROM users WHERE username = ?');
        $stmt->execute([$username]);
        if ((int)$stmt->fetchColumn() === 0 && !empty($password)) {
            $hash = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $pdo->prepare('INSERT INTO users (username, "passwordHash") VALUES (?, ?)');
            $stmt->execute([$username, $hash]);
        }

        // Check categories count
        $stmt = $pdo->query('SELECT COUNT(*) FROM categories');
        $catCount = (int)$stmt->fetchColumn();

        if ($catCount === 0 || $force) {
            if ($force) {
                $pdo->exec('DELETE FROM menu_items');
                $pdo->exec('DELETE FROM categories');
            }

            $categories = [
                [
                    'name' => 'نوشیدنی‌های گرم',
                    'name_en' => 'Hot Drinks',
                    'icon' => 'coffee',
                    'image_url' => self::img('photo-1509042239860-f550ce710b93'),
                    'sort' => 1,
                    'items' => [
                        [
                            'name' => 'چای زعفرانی',
                            'description' => 'چای دم‌کشیده با زعفران و هل، سرو شده با نبات',
                            'price' => 85000,
                            'sort' => 1,
                            'is_featured' => 1,
                            'image_url' => self::img('photo-1544787219-7f47ccb76574'),
                        ],
                        [
                            'name' => 'قهوه ترک',
                            'description' => 'قهوه اصیل ترک با دانه تازه آسیاب‌شده',
                            'price' => 120000,
                            'sort' => 2,
                            'is_featured' => 0,
                            'image_url' => self::img('photo-1447933601403-0c6688de566e'),
                        ],
                        [
                            'name' => 'اسپرسو',
                            'description' => 'شات اسپرسو با کرِمای غلیظ',
                            'price' => 110000,
                            'sort' => 3,
                            'is_featured' => 0,
                            'image_url' => self::img('photo-1509042239860-f550ce710b93'),
                        ],
                        [
                            'name' => 'کاپوچینو',
                            'description' => 'اسپرسو با شیر بخارداده و فوم نرم',
                            'price' => 145000,
                            'sort' => 4,
                            'is_featured' => 0,
                            'image_url' => self::img('photo-1461023058943-07fcbe16d735'),
                        ],
                        [
                            'name' => 'هات‌چاکلت یزدی',
                            'description' => 'شکلات داغ غلیظ با طعم گلاب',
                            'price' => 150000,
                            'sort' => 5,
                            'is_featured' => 0,
                            'image_url' => self::img('photo-1542990253-0d0f5be5f0ed'),
                        ],
                    ],
                ],
                [
                    'name' => 'نوشیدنی‌های سرد',
                    'name_en' => 'Cold Drinks',
                    'icon' => 'cup-soda',
                    'image_url' => self::img('photo-1517701604599-bb29b565090c'),
                    'sort' => 2,
                    'items' => [
                        [
                            'name' => 'شربت سکنجبین',
                            'description' => 'سکنجبین خانگی با خیار و نعنا',
                            'price' => 95000,
                            'sort' => 1,
                            'is_featured' => 1,
                            'image_url' => self::img('photo-1499638673689-79a0b5115d87'),
                        ],
                        [
                            'name' => 'شربت بیدمشک',
                            'description' => 'بیدمشک خالص با گلاب و یخ',
                            'price' => 90000,
                            'sort' => 2,
                            'is_featured' => 0,
                            'image_url' => self::img('photo-1544145945-f90425340c7e'),
                        ],
                        [
                            'name' => 'لیموناد نعنا',
                            'description' => 'لیموی تازه با نعنا و کمی عسل',
                            'price' => 105000,
                            'sort' => 3,
                            'is_featured' => 0,
                            'image_url' => self::img('photo-1556881286-fc6915169721'),
                        ],
                        [
                            'name' => 'آیس‌لته',
                            'description' => 'اسپرسو روی شیر سرد و یخ',
                            'price' => 155000,
                            'sort' => 4,
                            'is_featured' => 0,
                            'image_url' => self::img('photo-1517701604599-bb29b565090c'),
                        ],
                    ],
                ],
                [
                    'name' => 'دسر و شیرینی',
                    'name_en' => 'Desserts & Pastries',
                    'icon' => 'cake',
                    'image_url' => self::img('photo-1509365465985-25d11c17e812'),
                    'sort' => 3,
                    'items' => [
                        [
                            'name' => 'باقلوا',
                            'description' => 'باقلوای خانگی با مغز پسته و بادام',
                            'price' => 130000,
                            'sort' => 1,
                            'is_featured' => 1,
                            'image_url' => self::img('photo-1509365465985-25d11c17e812'),
                        ],
                        [
                            'name' => 'کیک یزدی',
                            'description' => 'کیک سنتی یزد با گلاب و هل',
                            'price' => 75000,
                            'sort' => 2,
                            'is_featured' => 0,
                            'image_url' => self::img('photo-1464349095431-e9a21285b5f3'),
                        ],
                        [
                            'name' => 'قطاب',
                            'description' => 'قطاب تازه با مغز بادام و پودر قند',
                            'price' => 85000,
                            'sort' => 3,
                            'is_featured' => 0,
                            'image_url' => self::img('photo-1495474472287-4d71bcdd2085'),
                        ],
                        [
                            'name' => 'پشمک سنتی',
                            'description' => 'پشمک دست‌ساز یزدی با چای',
                            'price' => 65000,
                            'sort' => 4,
                            'is_featured' => 0,
                            'image_url' => self::img('photo-1551024506-0bccd828d307'),
                        ],
                    ],
                ],
                [
                    'name' => 'طعم‌های سنتی یزد',
                    'name_en' => 'Traditional Yazd',
                    'icon' => 'utensils',
                    'image_url' => self::img('photo-1621263764928-df1444c5e859'),
                    'sort' => 4,
                    'items' => [
                        [
                            'name' => 'فالوده یزدی',
                            'description' => 'فالوده سنتی با آبلیمو و خلال پسته',
                            'price' => 115000,
                            'sort' => 1,
                            'is_featured' => 1,
                            'image_url' => self::img('photo-1621263764928-df1444c5e859'),
                        ],
                        [
                            'name' => 'شله‌زرد',
                            'description' => 'شله‌زرد زعفرانی با دارچین و خلال بادام',
                            'price' => 95000,
                            'sort' => 2,
                            'is_featured' => 0,
                            'image_url' => self::img('photo-1488477181946-6428a0291777'),
                        ],
                        [
                            'name' => 'آش شولی یزدی',
                            'description' => 'آش سنتی یزد با سرکه و نعنا',
                            'price' => 140000,
                            'sort' => 3,
                            'is_featured' => 0,
                            'image_url' => self::img('photo-1547592166-23ac45744acd'),
                        ],
                    ],
                ],
            ];

            $catStmt = $pdo->prepare('INSERT INTO categories (name, "nameEn", icon, "imageUrl", sort) VALUES (?, ?, ?, ?, ?)');
            $itemStmt = $pdo->prepare('INSERT INTO menu_items (name, description, price, sort, "isFeatured", "isAvailable", "imageUrl", "categoryId") VALUES (?, ?, ?, ?, ?, 1, ?, ?)');

            foreach ($categories as $cat) {
                $catStmt->execute([
                    $cat['name'],
                    $cat['name_en'],
                    $cat['icon'],
                    $cat['image_url'],
                    $cat['sort'],
                ]);
                $catId = (int)$pdo->lastInsertId();

                foreach ($cat['items'] as $item) {
                    $itemStmt->execute([
                        $item['name'],
                        $item['description'],
                        $item['price'],
                        $item['sort'],
                        $item['is_featured'],
                        $item['image_url'],
                        $catId,
                    ]);
                }
            }
        }

        // Settings
        $stmt = $pdo->query('SELECT COUNT(*) FROM site_settings');
        if ((int)$stmt->fetchColumn() === 0) {
            $defaultHero = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&q=80&auto=format&fit=crop';
            $stmt = $pdo->prepare('INSERT INTO site_settings ("heroImageUrl", "taxPercent") VALUES (?, ?)');
            $stmt->execute([$defaultHero, 10]);
        }
    }
}
