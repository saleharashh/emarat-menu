<?php

require_once dirname(__DIR__) . '/Database.php';
require_once dirname(__DIR__) . '/Router.php';

class MenuItemsController {
    public static function formatItem(array $row, ?array $category = null): array {
        $catId = $row['categoryId'] ?? ($row['category_id'] ?? null);
        $isAvail = isset($row['isAvailable']) ? $row['isAvailable'] : (isset($row['is_available']) ? $row['is_available'] : true);
        $isFeat = isset($row['isFeatured']) ? $row['isFeatured'] : (isset($row['is_featured']) ? $row['is_featured'] : false);

        return [
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'nameEn' => $row['nameEn'] ?? ($row['name_en'] ?? null),
            'description' => $row['description'] ?? null,
            'price' => (int)$row['price'],
            'imageUrl' => $row['imageUrl'] ?? ($row['image_url'] ?? null),
            'isAvailable' => (bool)$isAvail,
            'isFeatured' => (bool)$isFeat,
            'sort' => (int)($row['sort'] ?? 0),
            'categoryId' => $catId !== null && $catId !== '' ? (int)$catId : null,
            'category' => $category,
        ];
    }

    public static function list(): void {
        $pdo = Database::getConnection();
        $categoryId = isset($_GET['categoryId']) && is_numeric($_GET['categoryId']) ? (int)$_GET['categoryId'] : null;

        // Fetch categories lookup
        $catStmt = $pdo->query('SELECT * FROM categories');
        $catLookup = [];
        while ($c = $catStmt->fetch()) {
            $parentId = $c['parentId'] ?? ($c['parent_id'] ?? null);
            $catLookup[$c['id']] = [
                'id' => (int)$c['id'],
                'name' => $c['name'],
                'nameEn' => $c['nameEn'] ?? ($c['name_en'] ?? null),
                'icon' => $c['icon'] ?? null,
                'imageUrl' => $c['imageUrl'] ?? ($c['image_url'] ?? null),
                'sort' => (int)($c['sort'] ?? 0),
                'parentId' => $parentId !== null && $parentId !== '' ? (int)$parentId : null,
            ];
        }

        if ($categoryId !== null) {
            $stmt = $pdo->prepare('SELECT * FROM menu_items WHERE "categoryId" = ? ORDER BY sort ASC, id ASC');
            $stmt->execute([$categoryId]);
        } else {
            $stmt = $pdo->query('SELECT * FROM menu_items ORDER BY sort ASC, id ASC');
        }

        $items = [];
        while ($row = $stmt->fetch()) {
            $catId = $row['categoryId'] ?? ($row['category_id'] ?? null);
            $cat = ($catId && isset($catLookup[$catId])) ? $catLookup[$catId] : null;
            $items[] = self::formatItem($row, $cat);
        }

        Router::json($items);
    }

    public static function get(array $params): void {
        $id = (int)($params['id'] ?? 0);
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare('SELECT * FROM menu_items WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            Router::error('آیتم یافت نشد', 404);
        }

        $cat = null;
        $catId = $row['categoryId'] ?? ($row['category_id'] ?? null);
        if (!empty($catId)) {
            $cStmt = $pdo->prepare('SELECT * FROM categories WHERE id = ?');
            $cStmt->execute([$catId]);
            $cRow = $cStmt->fetch();
            if ($cRow) {
                $parentId = $cRow['parentId'] ?? ($cRow['parent_id'] ?? null);
                $cat = [
                    'id' => (int)$cRow['id'],
                    'name' => $cRow['name'],
                    'nameEn' => $cRow['nameEn'] ?? ($cRow['name_en'] ?? null),
                    'icon' => $cRow['icon'] ?? null,
                    'imageUrl' => $cRow['imageUrl'] ?? ($cRow['image_url'] ?? null),
                    'sort' => (int)($cRow['sort'] ?? 0),
                    'parentId' => $parentId !== null && $parentId !== '' ? (int)$parentId : null,
                ];
            }
        }

        Router::json(self::formatItem($row, $cat));
    }

    public static function create(): void {
        $body = Router::getJsonBody();
        $name = trim($body['name'] ?? '');
        $price = isset($body['price']) ? (int)$body['price'] : 0;

        if (empty($name)) {
            Router::error('نام آیتم الزامی است', 400);
        }

        $nameEn = $body['nameEn'] ?? null;
        $description = $body['description'] ?? null;
        $imageUrl = $body['imageUrl'] ?? null;
        $isAvailable = isset($body['isAvailable']) ? ($body['isAvailable'] ? 1 : 0) : 1;
        $isFeatured = isset($body['isFeatured']) ? ($body['isFeatured'] ? 1 : 0) : 0;
        $sort = (int)($body['sort'] ?? 0);
        $categoryId = !empty($body['categoryId']) ? (int)$body['categoryId'] : null;

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('INSERT INTO menu_items (name, "nameEn", description, price, "imageUrl", "isAvailable", "isFeatured", sort, "categoryId") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$name, $nameEn, $description, $price, $imageUrl, $isAvailable, $isFeatured, $sort, $categoryId]);
        $id = (int)$pdo->lastInsertId();

        self::get(['id' => $id]);
    }

    public static function update(array $params): void {
        $id = (int)($params['id'] ?? 0);
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare('SELECT * FROM menu_items WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            Router::error('آیتم یافت نشد', 404);
        }

        $current = self::formatItem($row);
        $body = Router::getJsonBody();

        $name = array_key_exists('name', $body) ? trim($body['name']) : $current['name'];
        $nameEn = array_key_exists('nameEn', $body) ? $body['nameEn'] : $current['nameEn'];
        $description = array_key_exists('description', $body) ? $body['description'] : $current['description'];
        $price = array_key_exists('price', $body) ? (int)$body['price'] : $current['price'];
        $imageUrl = array_key_exists('imageUrl', $body) ? $body['imageUrl'] : $current['imageUrl'];
        $isAvailable = array_key_exists('isAvailable', $body) ? ($body['isAvailable'] ? 1 : 0) : ($current['isAvailable'] ? 1 : 0);
        $isFeatured = array_key_exists('isFeatured', $body) ? ($body['isFeatured'] ? 1 : 0) : ($current['isFeatured'] ? 1 : 0);
        $sort = array_key_exists('sort', $body) ? (int)$body['sort'] : $current['sort'];
        $categoryId = array_key_exists('categoryId', $body)
            ? (!empty($body['categoryId']) ? (int)$body['categoryId'] : null)
            : $current['categoryId'];

        $stmt = $pdo->prepare('UPDATE menu_items SET name = ?, "nameEn" = ?, description = ?, price = ?, "imageUrl" = ?, "isAvailable" = ?, "isFeatured" = ?, sort = ?, "categoryId" = ? WHERE id = ?');
        $stmt->execute([$name, $nameEn, $description, $price, $imageUrl, $isAvailable, $isFeatured, $sort, $categoryId, $id]);

        self::get(['id' => $id]);
    }

    public static function delete(array $params): void {
        $id = (int)($params['id'] ?? 0);
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare('SELECT * FROM menu_items WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            Router::error('آیتم یافت نشد', 404);
        }

        $stmt = $pdo->prepare('DELETE FROM menu_items WHERE id = ?');
        $stmt->execute([$id]);
        Router::json(['ok' => true]);
    }
}
