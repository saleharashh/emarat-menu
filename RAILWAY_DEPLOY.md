# راهنمای دیپلوی پروژه روی Railway

این پروژه شامل دو سرویس مجزا (`backend` و `frontend`) و یک دیتابیس `PostgreSQL` است.

## ۱. ساخت پروژه و دیتابیس در Railway

1. در داشبورد Railway یک **New Project** بسازید.
2. گزینه **Add PostgreSQL** را انتخاب کنید تا سرویس دیتابیس ساخته شود.

## ۲. راه‌اندازی سرویس Backend (NestJS)

1. در همان پروژه، روی **+ Create -> GitHub Repo** کلیک کنید و رپازیتوری `emarat-menu` را انتخاب کنید.
2. در تنظیمات سرویس (`Settings`):
   - **Root Directory**: `/backend`
   - **Config-as-code / Config File Path**: `/backend/railway.toml`
   - از بخش **Networking** یک **Public Domain** تولید کنید (مثلاً `https://emarat-backend.up.railway.app`).
3. (اختیاری ولی پیشنهادی برای ماندگاری عکس‌های آپلودشده) یک **Volume** به سرویس Backend متصل کنید:
   - **Mount Path**: `/data/uploads`
   - متغیر `UPLOAD_DIR=/data/uploads` را در Variables ست کنید.
4. در بخش **Variables** سرویس Backend این متغیرها را تنظیم کنید:
   - `DATABASE_URL`: `${{Postgres.DATABASE_URL}}`
   - `JWT_SECRET`: یک رشته تصادفی و امن
   - `ADMIN_USERNAME`: `admin`
   - `ADMIN_PASSWORD`: رمز عبور ادمین
   - `AUTO_SEED`: `true` (در اولین اجرا دیتابیس را به‌صورت خودکار و idempotent سید می‌کند؛ بعداً می‌توانید `false` کنید)
   - `CORS_ORIGIN`: آدرس عمومی سرویس Frontend (مثلاً `https://emarat-frontend.up.railway.app`)
   - `UPLOAD_DIR`: `/data/uploads` (در صورت اتصال Volume)

## ۳. راه‌اندازی سرویس Frontend (Next.js)

1. دوباره در همان پروژه، روی **+ Create -> GitHub Repo** کلیک کنید و رپازیتوری `emarat-menu` را انتخاب کنید.
2. در تنظیمات سرویس (`Settings`):
   - **Root Directory**: `/frontend`
   - **Config-as-code / Config File Path**: `/frontend/railway.toml`
   - از بخش **Networking** یک **Public Domain** تولید کنید.
3. در بخش **Variables** سرویس Frontend این متغیر را تنظیم کنید (حتماً **قبل از Build** ست شود):
   - `NEXT_PUBLIC_API_URL`: آدرس کامل Public Domain سرویس Backend بدون اسلش انتهایی (مثلاً `https://emarat-backend.up.railway.app`)
4. پس از ست کردن `NEXT_PUBLIC_API_URL`، در صورت نیاز یک **Redeploy** روی Frontend بزنید تا آدرس در بیلد Next.js قرار بگیرد، و مطمئن شوید `CORS_ORIGIN` در Backend با آدرس Frontend برابر است.
