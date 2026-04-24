import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const { email, password, redirectTo } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  // Collect cookies Supabase wants to set — apply them to the final response
  const pendingCookies: { name: string; value: string; options: Record<string, unknown> }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          pendingCookies.push(
            ...cookiesToSet.map(({ name, value, options }) => ({
              name,
              value,
              options: options as Record<string, unknown>,
            }))
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.log("[api/auth/login] signInWithPassword error:", error.message);
    const msg = error.message ?? "";
    if (msg.toLowerCase().includes("not confirmed")) {
      return NextResponse.json(
        { error: "Please verify your email first. Check your inbox for the 6-digit code." },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: msg || "Invalid email or password." }, { status: 401 });
  }

  console.log("[api/auth/login] auth success, user:", data.user.id);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("onboarding_done")
    .eq("id", data.user.id)
    .single();

  console.log("[api/auth/login] profile:", { profile, profileError: profileError?.message });

  const destination = !profile?.onboarding_done
    ? "/onboarding"
    : (redirectTo ?? "/dashboard");

  console.log("[api/auth/login] cookies to set:", pendingCookies.map((c) => c.name));
  console.log("[api/auth/login] destination:", destination);

  const res = NextResponse.json({ destination });

  // Write session cookies into the response so the browser has them before navigating
  pendingCookies.forEach(({ name, value, options }) => {
    res.cookies.set(name, value, options as Parameters<typeof res.cookies.set>[2]);
  });

  return res;
}
