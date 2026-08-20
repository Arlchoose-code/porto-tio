"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth.schema";
import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("auth_token")) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setLoading(true);
      await authApi.login(data);
      toast.success("Welcome back, Sulistio Murti Mulyono!");
      // Hard navigation to ensure cookies are immediately committed across layout
      window.location.href = "/admin/dashboard";
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-white">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl mx-auto shadow-lg shadow-indigo-500/20">
            T
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin CMS Portal</h1>
          <p className="text-xs text-slate-400">
            Portfolio Management &amp; Content Administration
          </p>
        </div>

        <Card className="border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl text-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-base text-white">Sign In to Dashboard</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Enter your administrative credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="admin@tiomurti.com"
                    autoComplete="email"
                    className="pl-9 h-10 text-xs bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pl-9 h-10 text-xs bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                  />
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-400">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}