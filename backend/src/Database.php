<?php

require_once __DIR__ . '/Env.php';

class Database {
    private static ?PDO $pdo = null;

    public static function getConnection(): PDO {
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        $databaseUrl = Env::get('DATABASE_URL');
        $dbHost = Env::get('DB_HOST');
        $driver = 'sqlite';

        if (!empty($databaseUrl)) {
            $parsed = parse_url($databaseUrl);
            $scheme = $parsed['scheme'] ?? 'sqlite';
            if ($scheme === 'postgres' || $scheme === 'postgresql') {
                $host = $parsed['host'] ?? 'localhost';
                $port = $parsed['port'] ?? 5432;
                $user = $parsed['user'] ?? '';
                $pass = $parsed['pass'] ?? '';
                $dbName = ltrim($parsed['path'] ?? '', '/');
                $dsn = "pgsql:host={$host};port={$port};dbname={$dbName}";
                try {
                    self::$pdo = new PDO($dsn, $user, $pass, [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    ]);
                    $driver = 'pgsql';
                } catch (Exception $e) {
                    error_log("Failed to connect to PG via DATABASE_URL, fallback to SQLite: " . $e->getMessage());
                }
            } elseif ($scheme === 'mysql') {
                $host = $parsed['host'] ?? 'localhost';
                $port = $parsed['port'] ?? 3306;
                $user = $parsed['user'] ?? '';
                $pass = $parsed['pass'] ?? '';
                $dbName = ltrim($parsed['path'] ?? '', '/');
                $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4";
                try {
                    self::$pdo = new PDO($dsn, $user, $pass, [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    ]);
                    $driver = 'mysql';
                } catch (Exception $e) {
                    error_log("Failed to connect to MySQL via DATABASE_URL, fallback to SQLite: " . $e->getMessage());
                }
            }
        } elseif (!empty($dbHost)) {
            $port = Env::get('DB_PORT', 5432);
            $user = Env::get('DB_USER', 'postgres');
            $pass = Env::get('DB_PASSWORD', '');
            $dbName = Env::get('DB_NAME', 'emarat_menu');
            $dsn = "pgsql:host={$dbHost};port={$port};dbname={$dbName}";
            try {
                self::$pdo = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
                $driver = 'pgsql';
            } catch (Exception $e) {
                error_log("Postgres not available, using SQLite local database: " . $e->getMessage());
            }
        }

        if (self::$pdo === null) {
            $dataDir = dirname(__DIR__) . '/data';
            if (!is_dir($dataDir)) {
                mkdir($dataDir, 0777, true);
            }
            $sqlitePath = $dataDir . '/database.sqlite';
            self::$pdo = new PDO("sqlite:{$sqlitePath}", null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            self::$pdo->exec('PRAGMA foreign_keys = ON;');
            $driver = 'sqlite';
        }

        self::migrate($driver);
        return self::$pdo;
    }

    private static function migrate(string $driver): void {
        $pdo = self::$pdo;
        $idType = $driver === 'pgsql' ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
        $timestampDefault = 'CURRENT_TIMESTAMP';

        // users
        $pdo->exec("CREATE TABLE IF NOT EXISTS users (
            id {$idType},
            username VARCHAR(100) NOT NULL UNIQUE,
            \"passwordHash\" VARCHAR(255) NOT NULL,
            \"createdAt\" TIMESTAMP DEFAULT {$timestampDefault}
        )");

        // categories
        $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
            id {$idType},
            name VARCHAR(255) NOT NULL,
            \"nameEn\" VARCHAR(255),
            icon VARCHAR(100),
            \"imageUrl\" TEXT,
            sort INTEGER DEFAULT 0,
            \"parentId\" INTEGER,
            FOREIGN KEY (\"parentId\") REFERENCES categories(id) ON DELETE SET NULL
        )");

        // menu_items
        $pdo->exec("CREATE TABLE IF NOT EXISTS menu_items (
            id {$idType},
            name VARCHAR(255) NOT NULL,
            \"nameEn\" VARCHAR(255),
            description TEXT,
            price INTEGER NOT NULL,
            \"imageUrl\" TEXT,
            \"isAvailable\" BOOLEAN DEFAULT 1,
            \"isFeatured\" BOOLEAN DEFAULT 0,
            sort INTEGER DEFAULT 0,
            \"categoryId\" INTEGER,
            FOREIGN KEY (\"categoryId\") REFERENCES categories(id) ON DELETE SET NULL
        )");

        // site_settings
        $pdo->exec("CREATE TABLE IF NOT EXISTS site_settings (
            id {$idType},
            \"heroImageUrl\" TEXT,
            \"taxPercent\" INTEGER DEFAULT 10
        )");
    }
}
