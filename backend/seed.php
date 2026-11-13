<?php

declare(strict_types=1);

require_once __DIR__ . '/src/Env.php';
require_once __DIR__ . '/src/Database.php';
require_once __DIR__ . '/src/Seeder.php';

Env::load(__DIR__ . '/.env');

echo "Initializing database connection...\n";
$pdo = Database::getConnection();

echo "Running seeder...\n";
$force = in_array('--force', $argv, true);
Seeder::run($pdo, $force);

echo "Database seeding completed successfully!\n";
