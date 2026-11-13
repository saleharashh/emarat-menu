<?php

require_once dirname(__DIR__) . '/Database.php';
require_once dirname(__DIR__) . '/JWT.php';
require_once dirname(__DIR__) . '/Env.php';
require_once dirname(__DIR__) . '/Router.php';

class AuthController {
    public static function login(): void {
        $body = Router::getJsonBody();
        $username = trim($body['username'] ?? '');
        $password = $body['password'] ?? '';

        if (empty($username) || empty($password)) {
            Router::error('نام کاربری و رمز عبور الزامی است', 400);
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM users WHERE username = ?');
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        $hash = $user['passwordHash'] ?? $user['password_hash'] ?? null;

        if (!$user || empty($hash) || !password_verify($password, $hash)) {
            Router::error('نام کاربری یا رمز عبور اشتباه است', 401);
        }

        $secret = Env::get('JWT_SECRET', 'emarat_jwt_secret_key_123456');
        $accessToken = JWT::sign([
            'sub' => (int)$user['id'],
            'username' => $user['username'],
        ], $secret);

        Router::json([
            'accessToken' => $accessToken,
            'username' => $user['username'],
        ]);
    }
}
