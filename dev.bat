@echo off
echo ========================================================
echo       Emarat Cafe Menu - PHP + Vite.js Development
echo ========================================================
echo.
echo 1. Starting PHP Backend on http://localhost:4000 ...
start "Emarat PHP Backend" cmd /k "php -S 0.0.0.0:4000 backend/router.php"

echo 2. Starting Vite Frontend on http://localhost:3000 ...
cd frontend
npm run dev
