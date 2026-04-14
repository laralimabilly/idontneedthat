"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, KeyRound, CheckCircle } from "lucide-react";

type Mode = "magic-link" | "reset-password";

export default function ForgotPasswordPage() {
  const [mode, setMode] = useState<Mode>("magic-link");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const redirectTo = `${window.location.origin}/auth/callback${mode === "reset-password" ? "?next=/reset-password" : ""}`;

    if (mode === "magic-link") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-6 p-8 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-neon-green" />
          <div>
            <h1 className="font-display text-2xl font-bold">Check your email</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "magic-link"
                ? "We sent a magic link to"
                : "We sent a password reset link to"}{" "}
              <span className="font-medium text-foreground">{email}</span>.
              Click the link in the email to{" "}
              {mode === "magic-link" ? "sign in" : "set a new password"}.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Didn&apos;t get it? Check your spam folder or{" "}
            <button
              onClick={() => setSent(false)}
              className="underline underline-offset-2 hover:text-foreground"
            >
              try again
            </button>
            .
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 p-8">
        <div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to login
          </Link>
        </div>

        <div className="text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Access your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose how you&apos;d like to get in
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-lg border border-border p-1">
          <button
            type="button"
            onClick={() => setMode("magic-link")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === "magic-link"
                ? "bg-neon-green text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            Magic Link
          </button>
          <button
            type="button"
            onClick={() => setMode("reset-password")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === "reset-password"
                ? "bg-neon-green text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" />
            Reset Password
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {mode === "magic-link"
            ? "Get a one-time login link sent to your email — no password needed."
            : "Get a link to set a new password for your account."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-neon-green text-foreground hover:bg-neon-green-dark font-semibold"
          >
            {loading
              ? "Sending..."
              : mode === "magic-link"
              ? "Send Magic Link"
              : "Send Reset Link"}
          </Button>
        </form>
      </div>
    </div>
  );
}
