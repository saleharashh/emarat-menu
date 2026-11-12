"use client";

import { FolderTreeIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
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
import { getCategoryIcon } from "@/lib/category-icons";
import { formatNumber } from "@/lib/format";
import type { Category, MenuItem } from "@/lib/types";

interface CategoriesManagerProps {
  categories: Category[];
  items: MenuItem[];
  loading: boolean;
  onChanged: () => void;
}

export function CategoriesManager({
  categories,
  items,
  loading,
  onChanged,
}: CategoriesManagerProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const itemCount = (categoryId: number) =>
    items.filter((item) => item.categoryId === categoryId).length;

  const categoryName = (id: number | null | undefined) =>
    id ? categories.find((c) => c.id === id)?.name ?? "—" : "اصلی";

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api(`/categories/${deleting.id}`, { method: "DELETE" });
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
        <CardTitle>دسته‌بندی‌ها</CardTitle>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <PlusIcon data-icon="inline-start" />
          افزودن دسته‌بندی
        </Button>
      </CardHeader>
      <CardContent>
        {categories.length === 0 && !loading ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderTreeIcon />
              </EmptyMedia>
              <EmptyTitle>دسته‌بندی وجود ندارد</EmptyTitle>
              <EmptyDescription>
                برای سازمان‌دهی منو، دسته‌بندی اضافه کنید.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام</TableHead>
                <TableHead>نوع / والد</TableHead>
                <TableHead>آیکون</TableHead>
                <TableHead>ترتیب</TableHead>
                <TableHead>تعداد آیتم‌ها</TableHead>
                <TableHead className="w-24">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => {
                const Icon = getCategoryIcon(category.icon);
                return (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div>{category.name}</div>
                      {category.nameEn && (
                        <div className="text-xs text-muted-foreground">
                          {category.nameEn}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.parentId
                        ? `زیرمجموعه ${categoryName(category.parentId)}`
                        : "اصلی"}
                    </TableCell>
                    <TableCell>
                      {Icon ? (
                        <Icon className="size-5 text-muted-foreground" />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{formatNumber(category.sort)}</TableCell>
                    <TableCell>{formatNumber(itemCount(category.id))}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditing(category);
                          setFormOpen(true);
                        }}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleting(category)}
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

      <CategoryFormDialog
        open={formOpen}
        category={editing}
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
            <AlertDialogTitle>حذف دسته‌بندی</AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف «{deleting?.name}» مطمئن هستید؟ آیتم‌های این
              دسته‌بندی حذف نمی‌شوند، فقط بدون دسته‌بندی خواهند شد.
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
