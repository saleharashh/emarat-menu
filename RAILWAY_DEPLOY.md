# راهنمای دیپلوی پروژه منوی کافه عمارت (PHP + Vite.js)

این پروژه شامل دو بخش مجزا است:
1. **Backend**: پیاده‌سازی شده با **PHP 8.2+** (معماری تمیز، بدون نیاز به فریم‌ورک‌های سنگین، احراز هویت JWT، پشتیبانی خودکار از دیتابیس‌های PostgreSQL و SQLite و سیستم سیدر خودکار).
2. **Frontend**: پیاده‌سازی شده با **Vite.js + React 19 + Tailwind CSS v4** (فوق‌العاده سریع، لود آنی با HMR، استایل شیشه‌ای کریستال دودی کافه عمارت).

---

## ۱. اجرای محلی پروژه (Development)

### روش سریع با اسکریپت:
فایل `dev.bat` را اجرا کنید یا در ترمینال دستور زیر را بزنید:
```bash
dev.bat
```

### روش دستی:
**ترمینال ۱ (بکند PHP):**
```bash
php -S 0.0.0.0:4000 backend/router.php
```

**ترمینال ۲ (فرانت‌اند Vite):**
```bash
cd frontend
npm run dev
```
سپس آدرس `http://localhost:3000` را در مرورگر باز کنید.

---

## ۲. متغیرهای محیطی Backend (`backend/.env`)

```env
PORT=4000
JWT_SECRET=your_super_secret_jwt_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password
AUTO_SEED=true
CORS_ORIGIN=*

# دیتابیس (اختیاری):
# در صورت تنظیم نشدن، به‌صورت پیش‌فرض از SQLite بدون نیاز به هیچ تنظیماتی در backend/data/database.sqlite استفاده می‌شود.
# در صورت اتصال به PostgreSQL یا MySQL:
DATABASE_URL=postgresql://user:pass@host:5432/dbname
# یا:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=pass
# DB_NAME=emarat_menu
```

---

## ۳. دیپلوی روی Railway

### ۳.۱. سرویس دیتابیس (اختیاری)
می‌توانید یک دیتابیس **PostgreSQL** در Railway اضافه کنید، یا بدون دیتابیس خارجی از فایل دیتابیس پایدار **SQLite** با اتصال یک Volume به مسیر `/data` استفاده کنید.

### ۳.۲. سرویس بکند (PHP)
1. در Railway روی **+ Create -> GitHub Repo** کلیک کنید و رپازیتوری را انتخاب نمایید.
2. در تنظیمات سرویس (`Settings`):
   - **Root Directory**: `/backend`
   - **Config-as-code**: `/backend/railway.toml`
   - از بخش **Networking** یک **Public Domain** بسازید (مثلاً `https://emarat-api.up.railway.app`).
3. متغیرهای محیطی در تب **Variables**:
   - `JWT_SECRET`: یک کلید تصادفی امن
   - `ADMIN_USERNAME`: `admin`
   - `ADMIN_PASSWORD`: رمز عبور امن پنل مدیریت
   - `AUTO_SEED`: `true`
   - `DATABASE_URL`: متغیر `${{Postgres.DATABASE_URL}}` (در صورت استفاده از Postgres)
   - `CORS_ORIGIN`: آدرس دامنه فرانت‌اند (یا `*`)

### ۳.۳. سرویس فرانت‌اند (Vite.js)
1. در همان پروژه Railway یک سرویس جدید از رپازیتوری بسازید.
2. در تنظیمات سرویس (`Settings`):
   - **Root Directory**: `/frontend`
   - **Config-as-code**: `/frontend/railway.toml`
   - از بخش **Networking** یک دامنه اختصاص دهید.
3. متغیرهای محیطی در تب **Variables**:
   - `VITE_API_URL`: آدرس کامل دامنه بکند بدون اسلش پایانی (مثلاً `https://emarat-api.up.railway.app`).

---

## ۴. ویژگی‌های بازسازی‌شده
- **سرعت لود بسیار بالا** به لطف جایگزینی Next.js با Vite.js.
- **سبک و بدون وابستگی سنگین در بکند**: حذف کامل `node_modules` حجیم در بخش بکند و استفاده از PHP Native مدرن.
- **پایداری کامل API**: حفظ ۱۰۰٪ ساختار مسیرهای REST (`/api/categories`, `/api/menu-items`, `/api/settings`, `/api/auth/login`, `/api/uploads`).
- **پنل مدیریت اختصاصی**: به آدرس `/admin` با قابلیت تغییر بنر، دسته‌بندی‌ها و آیتم‌های منو به همراه آپلود عکس.
