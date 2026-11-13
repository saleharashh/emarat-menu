<?php

require_once dirname(__DIR__) . '/Env.php';
require_once dirname(__DIR__) . '/Router.php';

class UploadsController {
    private const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
    private const ALLOWED_MIMES = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/avif',
    ];

    public static function getUploadDir(): string {
        $custom = Env::get('UPLOAD_DIR');
        if (!empty($custom)) {
            $dir = rtrim($custom, '/\\');
        } else {
            $dir = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'uploads';
        }
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }
        return $dir;
    }

    public static function upload(): void {
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            Router::error('فایلی ارسال نشد یا آپلود با خطا مواجه شد', 400);
        }

        $file = $_FILES['file'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        if (!in_array($ext, self::ALLOWED_EXTS, true)) {
            Router::error('فقط فایل تصویری مجاز است (jpg, png, webp, gif, avif)', 400);
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mime, self::ALLOWED_MIMES, true)) {
            Router::error('نوع فایل نامعتبر است', 400);
        }

        if ($file['size'] > 10 * 1024 * 1024) {
            Router::error('حداکثر حجم مجاز تصویر ۱۰ مگابایت است', 400);
        }

        $filename = sprintf('%d-%s.%s', time(), bin2hex(random_bytes(8)), $ext);
        $destination = self::getUploadDir() . DIRECTORY_SEPARATOR . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            Router::error('ذخیره‌سازی فایل با شکست مواجه شد', 500);
        }

        Router::json(['url' => "/uploads/{$filename}"]);
    }
}
