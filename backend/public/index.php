<?php

declare(strict_types=1);

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', '0');

require_once dirname(__DIR__) . '/src/Env.php';
require_once dirname(__DIR__) . '/src/Database.php';
require_once dirname(__DIR__) . '/src/Seeder.php';
require_once dirname(__DIR__) . '/src/Router.php';
require_once dirname(__DIR__) . '/src/Controllers/AuthController.php';
require_once dirname(__DIR__) . '/src/Controllers/CategoriesController.php';
require_once dirname(__DIR__) . '/src/Controllers/MenuItemsController.php';
require_once dirname(__DIR__) . '/src/Controllers/SettingsController.php';
require_once dirname(__DIR__) . '/src/Controllers/UploadsController.php';

// Load environment variables
Env::load(dirname(__DIR__) . '/.env');

// Initialize DB and Seeder
try {
    $pdo = Database::getConnection();
    $autoSeed = Env::get('AUTO_SEED', true);
    if ($autoSeed) {
        Seeder::run($pdo, false);
    }
} catch (Throwable $e) {
    error_log("Database init error: " . $e->getMessage());
    Router::error('Database initialization error: ' . $e->getMessage(), 500);
}

// Setup Router
$router = new Router();

// Static uploads serving fallback
$router->get('/uploads/{file}', function (array $params) {
    $file = basename($params['file']);
    $path = UploadsController::getUploadDir() . DIRECTORY_SEPARATOR . $file;
    if (!file_exists($path)) {
        Router::error('File not found', 404);
    }
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $path);
    finfo_close($finfo);

    header("Content-Type: {$mime}");
    header('Content-Length: ' . filesize($path));
    readfile($path);
    exit;
});

// Authentication
$router->post('/api/auth/login', [AuthController::class, 'login']);

// Categories
$router->get('/api/categories', [CategoriesController::class, 'list']);
$router->post('/api/categories', [CategoriesController::class, 'create'], true);
$router->patch('/api/categories/{id}', [CategoriesController::class, 'update'], true);
$router->delete('/api/categories/{id}', [CategoriesController::class, 'delete'], true);

// Menu Items
$router->get('/api/menu-items', [MenuItemsController::class, 'list']);
$router->get('/api/menu-items/{id}', [MenuItemsController::class, 'get']);
$router->post('/api/menu-items', [MenuItemsController::class, 'create'], true);
$router->patch('/api/menu-items/{id}', [MenuItemsController::class, 'update'], true);
$router->delete('/api/menu-items/{id}', [MenuItemsController::class, 'delete'], true);

// Settings
$router->get('/api/settings', [SettingsController::class, 'get']);
$router->patch('/api/settings', [SettingsController::class, 'update'], true);

// Uploads
$router->post('/api/uploads', [UploadsController::class, 'upload'], true);

// Health check
$router->get('/api/health', function () {
    Router::json(['status' => 'ok', 'timestamp' => time()]);
});

$router->dispatch();
