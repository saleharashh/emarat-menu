<?php

require_once dirname(__DIR__) . '/Database.php';
require_once dirname(__DIR__) . '/Router.php';

class SettingsController {
    public const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&q=80&auto=format&fit=crop';

    private static function getOrInitSettings(PDO $pdo): array {
        $stmt = $pdo->query('SELECT * FROM site_settings LIMIT 1');
        $row = $stmt->fetch();
        if (!$row) {
            $stmt = $pdo->prepare('INSERT INTO site_settings ("heroImageUrl", "taxPercent") VALUES (?, ?)');
            $stmt->execute([self::DEFAULT_HERO_IMAGE, 10]);
            $stmt = $pdo->query('SELECT * FROM site_settings LIMIT 1');
            $row = $stmt->fetch();
        }
        $hero = $row['heroImageUrl'] ?? $row['hero_image_url'] ?? self::DEFAULT_HERO_IMAGE;
        $tax = $row['taxPercent'] ?? $row['tax_percent'] ?? 10;
        return [
            'id' => (int)$row['id'],
            'heroImageUrl' => $hero,
            'taxPercent' => (int)$tax,
        ];
    }

    public static function get(): void {
        $pdo = Database::getConnection();
        Router::json(self::getOrInitSettings($pdo));
    }

    public static function update(): void {
        $pdo = Database::getConnection();
        $current = self::getOrInitSettings($pdo);

        $body = Router::getJsonBody();
        $heroImageUrl = array_key_exists('heroImageUrl', $body) ? $body['heroImageUrl'] : $current['heroImageUrl'];
        $taxPercent = array_key_exists('taxPercent', $body) ? (int)$body['taxPercent'] : $current['taxPercent'];

        $stmt = $pdo->prepare('UPDATE site_settings SET "heroImageUrl" = ?, "taxPercent" = ? WHERE id = ?');
        $stmt->execute([$heroImageUrl, $taxPercent, $current['id']]);

        Router::json([
            'id' => $current['id'],
            'heroImageUrl' => $heroImageUrl,
            'taxPercent' => $taxPercent,
        ]);
    }
}
