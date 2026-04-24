"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

type Step = "form" | "otp";

export default function RegisterForm({ redirect }: { redirect?: string }) {
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      toast.error("Phone number must be 10 digits.");
      return;
    }

    setLoading(true);

    // Check if an account already exists with this email
    const checkRes = await fetch("/api/auth/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });
    const { exists } = await checkRes.json();

    if (exists) {
      toast.error("An account already exists with this email. Please log in instead.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: {
        shouldCreateUser: true,
        data: { name: form.name, phone: form.phone },
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "Failed to send code. Please try again.");
      return;
    }

    toast.success("Code sent! Check your inbox.");
    setStep("otp");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email: form.email,
      token: otp,
      type: "email",
    });

    if (error) {
      toast.error(error.message || "Invalid or expired code.");
      setLoading(false);
      return;
    }

    // Ensure profile has name + phone (trigger may not have metadata yet)
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        name: form.name,
        phone: form.phone || null,
      });
    }

    window.location.href = redirect ? `/onboarding?redirect=${redirect}` : "/onboarding";
  };

  const handleResend = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOtp({
      email: form.email,
      options: { shouldCreateUser: true, data: { name: form.name, phone: form.phone } },
    });
    setLoading(false);
    toast.success("New code sent.");
  };

  if (step === "otp") {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-7 w-7 text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-semibold">Verify your email</h2>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{form.email}</span>.
            Check your inbox (and spam folder).
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification code</Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="123456"
              className="text-center text-2xl tracking-[0.5em] font-mono"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
              autoFocus
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Verifying...</>
            ) : (
              "Verify & Continue"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive it?{" "}
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={handleResend}
            disabled={loading}
          >
            Resend code
          </button>
          {" · "}
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => { setStep("form"); setOtp(""); }}
          >
            Go back
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSendOtp} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Rahul Sharma"
          autoComplete="name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone number{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="9876543210"
          autoComplete="tel"
          maxLength={10}
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
          }
        />
      </div>

      <p className="text-xs text-muted-foreground">
        By creating an account, you agree to our{" "}
        <a href="/terms-and-conditions" className="text-primary hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" className="text-primary hover:underline">
          Privacy Policy
        </a>
        .
      </p>

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" />Sending code...</>
        ) : (
          "Create free account"
        )}
      </Button>
    </form>
  );
}
