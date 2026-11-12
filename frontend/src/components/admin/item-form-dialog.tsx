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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { api, uploadImage } from "@/lib/admin-api";
import { resolveImageUrl } from "@/lib/api";
import type { Category, MenuItem } from "@/lib/types";

interface ItemFormDialogProps {
  open: boolean;
  item: MenuItem | null;
  categories: Category[];
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function ItemFormDialog({
  open,
  item,
  categories,
  onOpenChange,
  onSaved,
}: ItemFormDialogProps) {
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const selectItems = useMemo(
    () =>
      Object.fromEntries([
        [0, "بدون دسته‌بندی"],
        ...categories.map((c) => [c.id, c.name] as [number, string]),
      ]),
    [categories],
  );

  useEffect(() => {
    if (!open) return;
    setName(item?.name ?? "");
    setNameEn(item?.nameEn ?? "");
    setDescription(item?.description ?? "");
    setPrice(item ? String(item.price) : "");
    setCategoryId(item?.categoryId ?? 0);
    setIsAvailable(item?.isAvailable ?? true);
    setIsFeatured(item?.isFeatured ?? false);
    setImageUrl(item?.imageUrl ?? null);
  }, [open, item]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
      toast.add({ title: "تصویر آپلود شد" });
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
    if (!name.trim() || !price) return;
    setSaving(true);
    try {
      const body = {
        name: name.trim(),
        nameEn: nameEn.trim() || null,
        description: description.trim() || null,
        price: Number(price),
        imageUrl: imageUrl || null,
        isAvailable,
        isFeatured,
        categoryId: categoryId === 0 ? null : categoryId,
      };
      await api(item ? `/menu-items/${item.id}` : "/menu-items", {
        method: item ? "PATCH" : "POST",
        body: JSON.stringify(body),
      });
      toast.add({
        title: item ? "ویرایش شد" : "افزوده شد",
        description: `«${body.name}» با موفقیت ذخیره شد`,
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "ویرایش آیتم" : "افزودن آیتم جدید"}</DialogTitle>
          <DialogDescription>
            اطلاعات آیتم منو را وارد کنید.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="item-name">نام آیتم</FieldLabel>
            <Input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً چای زعفرانی"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="item-name-en">
              نام انگلیسی (اختیاری)
            </FieldLabel>
            <Input
              id="item-name-en"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Saffron Tea"
              dir="ltr"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="item-description">توضیحات</FieldLabel>
            <Textarea
              id="item-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مواد تشکیل‌دهنده، طعم و..."
              rows={3}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="item-price">قیمت (تومان)</FieldLabel>
            <Input
              id="item-price"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="95000"
            />
          </Field>

          <Field>
            <FieldLabel>دسته‌بندی</FieldLabel>
            <Select
              items={selectItems}
              value={categoryId}
              onValueChange={(value) => setCategoryId(Number(value) || 0)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={0}>بدون دسته‌بندی</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field orientation="horizontal">
            <FieldLabel htmlFor="item-available">موجود است</FieldLabel>
            <Switch
              id="item-available"
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
            />
          </Field>

          <Field orientation="horizontal">
            <FieldLabel htmlFor="item-featured">
              پیشنهاد مجموعه (نمایش ویژه)
            </FieldLabel>
            <Switch
              id="item-featured"
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
            />
          </Field>

          <Field>
            <FieldLabel>تصویر</FieldLabel>
            <div className="flex items-center gap-3">
              {imageUrl ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveImageUrl(imageUrl)!}
                    alt="پیش‌نمایش"
                    className="size-16 rounded-md object-cover"
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
                    id="item-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    disabled={uploading}
                    nativeButton={false}
                    render={<label htmlFor="item-image" />}
                  >
                    <ImageIcon data-icon="inline-start" />
                    {uploading ? "در حال آپلود..." : "انتخاب و آپلود تصویر"}
                  </Button>
                </>
              )}
            </div>
          </Field>
        </FieldGroup>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={saving || !name.trim() || !price}
          >
            {saving ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
