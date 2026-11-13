<?php

require_once __DIR__ . '/Env.php';
require_once __DIR__ . '/JWT.php';

class Router {
    private array $routes = [];
    private ?array $currentUser = null;

    public function add(string $method, string $pattern, callable $handler, bool $requiresAuth = false): void {
        $this->routes[] = [
            'method' => strtoupper($method),
            'pattern' => $pattern,
            'handler' => $handler,
            'requiresAuth' => $requiresAuth,
        ];
    }

    public function get(string $pattern, callable $handler, bool $requiresAuth = false): void {
        $this->add('GET', $pattern, $handler, $requiresAuth);
    }

    public function post(string $pattern, callable $handler, bool $requiresAuth = false): void {
        $this->add('POST', $pattern, $handler, $requiresAuth);
    }

    public function patch(string $pattern, callable $handler, bool $requiresAuth = false): void {
        $this->add('PATCH', $pattern, $handler, $requiresAuth);
    }

    public function delete(string $pattern, callable $handler, bool $requiresAuth = false): void {
        $this->add('DELETE', $pattern, $handler, $requiresAuth);
    }

    public static function json(mixed $data, int $status = 200): void {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function error(string $message, int $status = 400): void {
        self::json(['message' => $message, 'statusCode' => $status], $status);
    }

    public static function getJsonBody(): array {
        $raw = file_get_contents('php://input');
        if (empty($raw)) {
            return [];
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    public static function getBearerToken(): ?string {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (empty($authHeader) && function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        }
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return trim($matches[1]);
        }
        return null;
    }

    public function dispatch(): void {
        $this->handleCors();

        $method = $_SERVER['REQUEST_METHOD'];
        if ($method === 'OPTIONS') {
            http_response_code(204);
            exit;
        }

        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        // Normalize trailing slashes (except root)
        if ($uri !== '/' && str_ends_with($uri, '/')) {
            $uri = rtrim($uri, '/');
        }

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            // Convert pattern {id} to regex named group
            $patternRegex = preg_replace('#\{([a-zA-Z0-9_]+)\}#', '(?P<$1>[^/]+)', $route['pattern']);
            $patternRegex = "#^{$patternRegex}$#";

            if (preg_match($patternRegex, $uri, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);

                if ($route['requiresAuth']) {
                    $token = self::getBearerToken();
                    $secret = Env::get('JWT_SECRET', 'emarat_jwt_secret_key_123456');
                    if (!$token) {
                        self::error('نشست شما منقضی شده است', 401);
                    }
                    $payload = JWT::verify($token, $secret);
                    if (!$payload) {
                        self::error('نشست شما منقضی شده است', 401);
                    }
                    $this->currentUser = $payload;
                }

                call_user_func($route['handler'], $params, $this->currentUser);
                return;
            }
        }

        self::error('مسیر مورد نظر یافت نشد', 404);
    }

    private function handleCors(): void {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
        $allowedOrigin = Env::get('CORS_ORIGIN', '*');

        if ($allowedOrigin === '*' || $allowedOrigin === $origin) {
            header("Access-Control-Allow-Origin: {$origin}");
            header('Access-Control-Allow-Credentials: true');
        } else {
            header("Access-Control-Allow-Origin: {$allowedOrigin}");
        }

        header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
    }
}
