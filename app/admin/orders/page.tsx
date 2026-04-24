import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

export default async function AdminOrdersPage() {
  const supabase = createClient();
  const serviceSupabase = createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) redirect("/dashboard");

  const { data: orders } = await serviceSupabase
    .from("orders")
    .select(
      "id, amount_inr, base_amount, gst_amount, discount_amount, promo_code, status, created_at, user_id, products(name, slug)"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const userIds = [...new Set((orders ?? []).map((o) => o.user_id))];
  const { data: profiles } = userIds.length
    ? await serviceSupabase
        .from("profiles")
        .select("id, name, phone")
        .in("id", userIds)
    : { data: [] };

  const profileMap: Record<string, { name: string; phone: string | null }> = {};
  (profiles ?? []).forEach((p) => {
    profileMap[p.id] = { name: p.name, phone: p.phone };
  });

  const successOrders = (orders ?? []).filter((o) => o.status === "SUCCESS");
  const totalRevenue = successOrders.reduce((sum, o) => sum + (o.amount_inr ?? 0), 0);

  const revenueByProduct: Record<string, number> = {};
  successOrders.forEach((o) => {
    const name = (o.products as { name: string } | null)?.name ?? "Unknown";
    revenueByProduct[name] = (revenueByProduct[name] ?? 0) + (o.amount_inr ?? 0);
  });

  const STATUS_STYLES: Record<string, string> = {
    SUCCESS: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    FAILED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Orders
        </h1>
        <p className="text-muted-foreground mt-1">
          {successOrders.length} successful · {formatCurrency(totalRevenue)} total revenue
        </p>
      </div>

      {/* Revenue breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(revenueByProduct).map(([name, rev]) => (
          <div key={name} className="rounded-xl border bg-background p-4">
            <div className="text-xs text-muted-foreground mb-1">{name}</div>
            <div className="text-xl font-bold">{formatCurrency(rev)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {successOrders.filter(
                (o) => (o.products as { name: string } | null)?.name === name
              ).length}{" "}
              orders
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">User</th>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Promo</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order) => {
              const p = profileMap[order.user_id];
              const productName =
                (order.products as { name: string } | null)?.name ?? "-";
              return (
                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{p?.name ?? "Unknown"}</div>
                    <div className="text-xs text-muted-foreground">{p?.phone ?? "-"}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{productName}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{formatCurrency(order.amount_inr ?? 0)}</div>
                    {order.discount_amount && order.discount_amount > 0 ? (
                      <div className="text-xs text-green-600">
                        −{formatCurrency(order.discount_amount)} discount
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order.promo_code ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_STYLES[order.status] ?? STATUS_STYLES.CANCELLED
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(order.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
