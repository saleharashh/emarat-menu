"use client";

import { KeyRoundIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
import { toast } from "@/components/ui/toast";
import { API_URL } from "@/lib/api";
import { setToken } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.message ?? "ورود ناموفق بود");
      }
      setToken(body.accessToken);
      router.push("/admin");
    } catch (err) {
      toast.add({
        title: "خطا",
        description: err instanceof Error ? err.message : "خطای ناشناخته",
      });
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm border-white/85 bg-card/75 shadow-[inset_0_2px_1.5px_rgba(255,255,255,0.95),0_24px_50px_-8px_rgba(56,30,16,0.14)] backdrop-blur-3xl dark:border-white/16 dark:bg-card/70">
        <CardHeader className="items-center text-center">
          <CardTitle className="flex items-center gap-2">
            <KeyRoundIcon className="size-5 text-primary" />
            ورود به پنل ادمین
          </CardTitle>
          <CardDescription>کافه عمارت — مدیریت منو</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">نام کاربری</FieldLabel>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">رمز عبور</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </Field>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "در حال ورود..." : "ورود"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
