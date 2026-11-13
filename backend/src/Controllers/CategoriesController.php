<?php

require_once dirname(__DIR__) . '/Database.php';
require_once dirname(__DIR__) . '/Router.php';

class CategoriesController {
    public static function formatCategory(array $row): array {
        $parentId = $row['parentId'] ?? $row['parent_id'] ?? null;
        return [
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'nameEn' => $row['nameEn'] ?? $row['name_en'] ?? null,
            'icon' => $row['icon'] ?? null,
            'imageUrl' => $row['imageUrl'] ?? $row['image_url'] ?? null,
            'sort' => (int)($row['sort'] ?? 0),
            'parentId' => $parentId !== null && $parentId !== '' ? (int)$parentId : null,
        ];
    }

    public static function list(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('SELECT * FROM categories ORDER BY sort ASC, id ASC');
        $rows = $stmt->fetchAll();
        $res = array_map([self::class, 'formatCategory'], $rows);
        Router::json($res);
    }

    public static function create(): void {
        $body = Router::getJsonBody();
        $name = trim($body['name'] ?? '');
        if (empty($name)) {
            Router::error('نام دسته‌بندی الزامی است', 400);
        }

        $nameEn = $body['nameEn'] ?? null;
        $icon = $body['icon'] ?? null;
        $imageUrl = $body['imageUrl'] ?? null;
        $sort = (int)($body['sort'] ?? 0);
        $parentId = !empty($body['parentId']) ? (int)$body['parentId'] : null;

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('INSERT INTO categories (name, "nameEn", icon, "imageUrl", sort, "parentId") VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([$name, $nameEn, $icon, $imageUrl, $sort, $parentId]);
        $id = (int)$pdo->lastInsertId();

        $stmt = $pdo->prepare('SELECT * FROM categories WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        Router::json(self::formatCategory($row), 201);
    }

    public static function update(array $params): void {
        $id = (int)($params['id'] ?? 0);
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare('SELECT * FROM categories WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            Router::error('دسته‌بندی یافت نشد', 404);
        }

        $current = self::formatCategory($row);
        $body = Router::getJsonBody();

        $name = array_key_exists('name', $body) ? trim($body['name']) : $current['name'];
        $nameEn = array_key_exists('nameEn', $body) ? $body['nameEn'] : $current['nameEn'];
        $icon = array_key_exists('icon', $body) ? $body['icon'] : $current['icon'];
        $imageUrl = array_key_exists('imageUrl', $body) ? $body['imageUrl'] : $current['imageUrl'];
        $sort = array_key_exists('sort', $body) ? (int)$body['sort'] : $current['sort'];
        $parentId = array_key_exists('parentId', $body)
            ? (!empty($body['parentId']) && (int)$body['parentId'] !== $id ? (int)$body['parentId'] : null)
            : $current['parentId'];

        $stmt = $pdo->prepare('UPDATE categories SET name = ?, "nameEn" = ?, icon = ?, "imageUrl" = ?, sort = ?, "parentId" = ? WHERE id = ?');
        $stmt->execute([$name, $nameEn, $icon, $imageUrl, $sort, $parentId, $id]);

        $stmt = $pdo->prepare('SELECT * FROM categories WHERE id = ?');
        $stmt->execute([$id]);
        Router::json(self::formatCategory($stmt->fetch()));
    }

    public static function delete(array $params): void {
        $id = (int)($params['id'] ?? 0);
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare('SELECT * FROM categories WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            Router::error('دسته‌بندی یافت نشد', 404);
        }

        $stmt = $pdo->prepare('DELETE FROM categories WHERE id = ?');
        $stmt->execute([$id]);
        Router::json(['ok' => true]);
    }
}
