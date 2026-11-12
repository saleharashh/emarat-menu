"use client";

import { CoffeeIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { ItemFormDialog } from "@/components/admin/item-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/admin-api";
import { resolveImageUrl } from "@/lib/api";
import { formatToman } from "@/lib/format";
import type { Category, MenuItem } from "@/lib/types";

interface ItemsManagerProps {
  items: MenuItem[];
  categories: Category[];
  loading: boolean;
  onChanged: () => void;
}

export function ItemsManager({
  items,
  categories,
  loading,
  onChanged,
}: ItemsManagerProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [deleting, setDeleting] = useState<MenuItem | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api(`/menu-items/${deleting.id}`, { method: "DELETE" });
      toast.add({ title: "حذف شد", description: `«${deleting.name}» حذف شد` });
      setDeleting(null);
      onChanged();
    } catch (err) {
      toast.add({
        title: "خطا",
        description: err instanceof Error ? err.message : "حذف ناموفق بود",
      });
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>آیتم‌های منو</CardTitle>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <PlusIcon data-icon="inline-start" />
          افزودن آیتم
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 && !loading ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CoffeeIcon />
              </EmptyMedia>
              <EmptyTitle>منو خالی است</EmptyTitle>
              <EmptyDescription>
                اولین آیتم منو را اضافه کنید.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">تصویر</TableHead>
                <TableHead>نام</TableHead>
                <TableHead>دسته‌بندی</TableHead>
                <TableHead>قیمت</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead className="w-24">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const image = resolveImageUrl(item.imageUrl);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex size-10 items-center justify-center overflow-hidden rounded-md bg-secondary">
                        {image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={image}
                            alt={item.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <CoffeeIcon className="size-5 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                        {item.isFeatured && (
                          <Badge variant="outline">پیشنهاد مجموعه</Badge>
                        )}
                      </div>
                      {item.nameEn && (
                        <div className="text-xs text-muted-foreground">
                          {item.nameEn}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{item.category?.name ?? "—"}</TableCell>
                    <TableCell>{formatToman(item.price)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.isAvailable ? "default" : "secondary"}
                      >
                        {item.isAvailable ? "موجود" : "ناموجود"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditing(item);
                            setFormOpen(true);
                          }}
                        >
                          <PencilIcon />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleting(item)}
                        >
                          <Trash2Icon className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <ItemFormDialog
        open={formOpen}
        item={editing}
        categories={categories}
        onOpenChange={setFormOpen}
        onSaved={onChanged}
      />

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف آیتم</AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف «{deleting?.name}» مطمئن هستید؟ این عمل قابل بازگشت
              نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleteBusy}
            >
              {deleteBusy ? "در حال حذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
