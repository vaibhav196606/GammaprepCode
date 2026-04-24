"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

type Step = "email" | "otp";

export default function LoginForm({ redirect }: { redirect?: string }) {
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("signup") || error.message.toLowerCase().includes("disabled")) {
        toast.error("No account found with this email. Please sign up first.");
      } else {
        toast.error(error.message || "Failed to send code. Please try again.");
      }
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
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      toast.error(error.message || "Invalid or expired code.");
      setLoading(false);
      return;
    }

    // Check onboarding status
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_done")
      .eq("id", data.user!.id)
      .single();

    window.location.href = !profile?.onboarding_done
      ? "/onboarding"
      : (redirect ?? "/dashboard");
  };

  const handleResend = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
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
          <h2 className="text-xl font-semibold">Enter the code</h2>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{email}</span>.
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
              "Sign in"
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
            onClick={() => { setStep("email"); setOtp(""); }}
          >
            Change email
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSendOtp} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" />Sending code...</>
        ) : (
          "Send login code"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Sign up for free
        </Link>
      </p>
    </form>
  );
}
