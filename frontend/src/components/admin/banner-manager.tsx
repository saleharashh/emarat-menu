"use client";

import { ImageIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { api, uploadImage } from "@/lib/admin-api";
import { resolveImageUrl } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";

export function BannerManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [taxInput, setTaxInput] = useState("10");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<SiteSettings>("/settings");
      setSettings(data);
      setUrlInput(data.heroImageUrl ?? "");
      setTaxInput(String(data.taxPercent ?? 10));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(payload: {
    heroImageUrl?: string | null;
    taxPercent?: number;
  }) {
    setSaving(true);
    try {
      const updated = await api<SiteSettings>("/settings", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setSettings(updated);
      setUrlInput(updated.heroImageUrl ?? "");
      setTaxInput(String(updated.taxPercent ?? 10));
      toast.add({ title: "تنظیمات به‌روزرسانی شد" });
    } catch (err) {
      toast.add({
        title: "خطا",
        description: err instanceof Error ? err.message : "ذخیره ناموفق بود",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      await save({ heroImageUrl: url });
    } catch (err) {
      toast.add({
        title: "خطا",
        description: err instanceof Error ? err.message : "آپلود ناموفق بود",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <Spinner />
        </CardContent>
      </Card>
    );
  }

  const preview = resolveImageUrl(settings?.heroImageUrl);

  return (
    <Card>
      <CardHeader>
        <CardTitle>تنظیمات و بنر سایت</CardTitle>
        <CardDescription>
          تنظیم درصد مالیات سبد خرید و تصویر کاور منوی کناری.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel>پیش‌نمایش</FieldLabel>
            <div className="relative aspect-16/7 overflow-hidden rounded-lg bg-secondary">
              {preview ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={preview}
                  alt="پیش‌نمایش بنر"
                  className="size-full object-cover"
                />
              ) : null}
              <div className="pattern-botanical absolute inset-0 flex items-center justify-center bg-black/55">
                <span className="rounded-xl border border-white/25 bg-white/10 px-6 py-4 text-white backdrop-blur-md">
                  متن شیشه‌ای بنر
                </span>
              </div>
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="banner-file">آپلود تصویر جدید</FieldLabel>
            <input
              id="banner-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              disabled={uploading || saving}
              nativeButton={false}
              render={<label htmlFor="banner-file" />}
            >
              <ImageIcon data-icon="inline-start" />
              {uploading ? "در حال آپلود..." : "انتخاب و آپلود تصویر"}
            </Button>
          </Field>

          <Field>
            <FieldLabel htmlFor="banner-url">یا لینک تصویر</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="banner-url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://..."
                dir="ltr"
              />
              <Button
                disabled={saving}
                onClick={() => save({ heroImageUrl: urlInput.trim() || null })}
              >
                {saving ? "در حال ذخیره..." : "ذخیره"}
              </Button>
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="tax-percent">درصد مالیات سبد خرید (٪)</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="tax-percent"
                type="number"
                min={0}
                max={100}
                value={taxInput}
                onChange={(e) => setTaxInput(e.target.value)}
                placeholder="10"
                dir="ltr"
              />
              <Button
                disabled={saving}
                onClick={() => {
                  const parsed = Math.min(100, Math.max(0, Number(taxInput) || 0));
                  save({ taxPercent: parsed });
                }}
              >
                {saving ? "در حال ذخیره..." : "ذخیره"}
              </Button>
            </div>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
