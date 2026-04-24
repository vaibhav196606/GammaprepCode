import { createServiceClient } from "@/lib/supabase/server";

export interface CashfreeConfig {
  baseUrl: string;
  appId: string;
  secretKey: string;
  isTestMode: boolean;
}

export async function getCashfreeConfig(): Promise<CashfreeConfig> {
  const serviceSupabase = createServiceClient();
  const { data } = await serviceSupabase
    .from("site_settings")
    .select("value")
    .eq("key", "cashfree_test_mode")
    .single();

  const isTestMode = (data?.value as boolean) ?? false;

  return {
    baseUrl: isTestMode
      ? "https://sandbox.cashfree.com/pg"
      : "https://api.cashfree.com/pg",
    appId: isTestMode
      ? process.env.CASHFREE_TEST_APP_ID!
      : process.env.CASHFREE_APP_ID!,
    secretKey: isTestMode
      ? process.env.CASHFREE_TEST_SECRET_KEY!
      : process.env.CASHFREE_SECRET_KEY!,
    isTestMode,
  };
}
