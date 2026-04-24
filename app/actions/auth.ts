"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAction(
  email: string,
  password: string,
  redirectTo?: string
): Promise<{ error: string }> {
  const supabase = createClient();

  console.log("[loginAction] attempting signInWithPassword for:", email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("[loginAction] signInWithPassword error:", error.message);
    const msg = error.message ?? "";
    if (
      msg.toLowerCase().includes("not confirmed") ||
      msg.toLowerCase().includes("email not confirmed")
    ) {
      return {
        error:
          "Please verify your email first. Check your inbox for the 6-digit code we sent you.",
      };
    }
    return { error: msg || "Invalid email or password." };
  }

  console.log("[loginAction] auth success, user id:", data.user.id);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("onboarding_done")
    .eq("id", data.user.id)
    .single();

  console.log("[loginAction] profile fetch:", { profile, profileError: profileError?.message });

  const destination = !profile?.onboarding_done
    ? "/onboarding"
    : (redirectTo ?? "/dashboard");

  console.log("[loginAction] redirecting to:", destination);
  redirect(destination);
}
