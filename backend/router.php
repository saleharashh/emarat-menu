<?php

// Router script for PHP built-in web server: php -S localhost:4000 backend/router.php

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Check if static file in uploads/
if (str_starts_with($uri, '/uploads/')) {
    $filePath = __DIR__ . $uri;
    if (file_exists($filePath) && is_file($filePath)) {
        return false; // serve file directly
    }
}

// Check if static file in public/
$publicFile = __DIR__ . '/public' . $uri;
if ($uri !== '/' && file_exists($publicFile) && is_file($publicFile)) {
    return false; // serve file directly
}

// Forward all other requests to public/index.php
require __DIR__ . '/public/index.php';
