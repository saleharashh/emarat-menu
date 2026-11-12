"use client";

import { ImageIcon, Trash2Icon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { api, uploadImage } from "@/lib/admin-api";
import { resolveImageUrl } from "@/lib/api";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import type { Category } from "@/lib/types";

interface CategoryFormDialogProps {
  open: boolean;
  category: Category | null;
  categories: Category[];
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function CategoryFormDialog({
  open,
  category,
  categories,
  onOpenChange,
  onSaved,
}: CategoryFormDialogProps) {
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [icon, setIcon] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [parentId, setParentId] = useState<number>(0);
  const [sort, setSort] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const iconItems = useMemo(
    () =>
      Object.fromEntries([
        ["", "بدون آیکون"],
        ...Object.entries(CATEGORY_ICONS).map(
          ([key, { label }]) => [key, label] as [string, string],
        ),
      ]),
    [],
  );

  const parentCandidates = useMemo(
    () =>
      categories.filter((c) => !c.parentId && c.id !== category?.id),
    [categories, category],
  );

  const parentItems = useMemo(
    () =>
      Object.fromEntries([
        [0, "دسته‌بندی اصلی (بدون والد)"],
        ...parentCandidates.map((c) => [c.id, c.name] as [number, string]),
      ]),
    [parentCandidates],
  );

  useEffect(() => {
    if (!open) return;
    setName(category?.name ?? "");
    setNameEn(category?.nameEn ?? "");
    setIcon(category?.icon ?? "");
    setImageUrl(category?.imageUrl ?? null);
    setParentId(category?.parentId ?? 0);
    setSort(category ? String(category.sort) : "");
  }, [open, category]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
      toast.add({ title: "تصویر دسته‌بندی آپلود شد" });
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

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const body = {
        name: name.trim(),
        nameEn: nameEn.trim() || null,
        icon: icon || null,
        imageUrl: imageUrl || null,
        parentId: parentId === 0 ? null : parentId,
        sort: sort ? Number(sort) : 0,
      };
      await api(category ? `/categories/${category.id}` : "/categories", {
        method: category ? "PATCH" : "POST",
        body: JSON.stringify(body),
      });
      toast.add({
        title: category ? "ویرایش شد" : "افزوده شد",
        description: `دسته‌بندی «${body.name}» ذخیره شد`,
      });
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.add({
        title: "خطا",
        description: err instanceof Error ? err.message : "ذخیره ناموفق بود",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی"}
          </DialogTitle>
          <DialogDescription>
            دسته‌بندی‌ها ترتیب و تصویر نوار بالای منو را مشخص می‌کنند.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="category-name">نام دسته‌بندی</FieldLabel>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً نوشیدنی‌های گرم"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="category-name-en">
              نام انگلیسی (اختیاری)
            </FieldLabel>
            <Input
              id="category-name-en"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Hot Drinks"
              dir="ltr"
            />
          </Field>

          <Field>
            <FieldLabel>دسته‌بندی والد (اختیاری)</FieldLabel>
            <Select
              items={parentItems}
              value={parentId}
              onValueChange={(value) => setParentId(Number(value) || 0)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={0}>دسته‌بندی اصلی (بدون والد)</SelectItem>
                  {parentCandidates.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>آیکون</FieldLabel>
            <Select
              items={iconItems}
              value={icon}
              onValueChange={(value) => setIcon(String(value ?? ""))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="">بدون آیکون</SelectItem>
                  {Object.entries(CATEGORY_ICONS).map(([key, { label, Icon }]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <Icon className="size-4" />
                        {label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>تصویر کارت دسته‌بندی (اختیاری)</FieldLabel>
            <div className="flex items-center gap-3">
              {imageUrl ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveImageUrl(imageUrl)!}
                    alt="پیش‌نمایش"
                    className="h-14 w-24 rounded-md object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setImageUrl(null)}
                  >
                    <Trash2Icon className="text-destructive" />
                    حذف تصویر
                  </Button>
                </div>
              ) : (
                <>
                  <input
                    id="category-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    disabled={uploading}
                    nativeButton={false}
                    render={<label htmlFor="category-image" />}
                  >
                    <ImageIcon data-icon="inline-start" />
                    {uploading ? "در حال آپلود..." : "انتخاب و آپلود تصویر"}
                  </Button>
                </>
              )}
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="category-sort">ترتیب نمایش</FieldLabel>
            <Input
              id="category-sort"
              type="number"
              min={0}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              placeholder="1"
            />
          </Field>
        </FieldGroup>

        <DialogFooter>
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
