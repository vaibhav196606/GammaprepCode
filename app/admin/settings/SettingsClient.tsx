"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, FlaskConical, ShieldCheck } from "lucide-react";

interface Product {
  id: string;
  slug: string;
  name: string;
  price_inr: number;
  original_price: number | null;
  is_active: boolean;
}

interface Props {
  settings: Record<string, unknown>;
  products: Product[];
}

export default function SettingsClient({ settings: initialSettings, products: initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const [cashfreeTestMode, setCashfreeTestMode] = useState<boolean>(
    (initialSettings.cashfree_test_mode as boolean) ?? false
  );
  const [savingCashfreeMode, setSavingCashfreeMode] = useState(false);

  const handleToggleCashfreeMode = async () => {
    const newMode = !cashfreeTestMode;
    setSavingCashfreeMode(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cashfree_test_mode: newMode }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCashfreeTestMode(newMode);
      toast.success(`Cashfree switched to ${newMode ? "TEST" : "PRODUCTION"} mode.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update.");
    }
    setSavingCashfreeMode(false);
  };

  // Site settings state
  const [stats, setStats] = useState({
    students_placed: String((initialSettings.homepage_stats as Record<string, number> | null)?.students_placed ?? "500+"),
    avg_hike: String((initialSettings.homepage_stats as Record<string, number> | null)?.avg_hike ?? "45%"),
    companies_hiring: String((initialSettings.homepage_stats as Record<string, number> | null)?.companies_hiring ?? "80+"),
    success_rate: String((initialSettings.homepage_stats as Record<string, number> | null)?.success_rate ?? "94%"),
  });
  const [batchDate, setBatchDate] = useState(
    String(initialSettings.next_batch_date ?? "")
  );
  const [whatsappLink, setWhatsappLink] = useState(
    String(initialSettings.whatsapp_link ?? "")
  );

  const [showGst, setShowGst] = useState<boolean>(
    (initialSettings.show_gst as boolean) ?? true
  );

  const [savingSettings, setSavingSettings] = useState(false);
  const [savingProduct, setSavingProduct] = useState<string | null>(null);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homepage_stats: {
            students_placed: stats.students_placed,
            avg_hike: stats.avg_hike,
            companies_hiring: stats.companies_hiring,
            success_rate: stats.success_rate,
          },
          next_batch_date: batchDate || null,
          whatsapp_link: whatsappLink || null,
          show_gst: showGst,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("Settings saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save.");
    }
    setSavingSettings(false);
  };

  const handleSaveProduct = async (p: Product) => {
    setSavingProduct(p.id);
    try {
      const res = await fetch(`/api/admin/settings/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price_inr: p.price_inr,
          original_price: p.original_price,
          is_active: p.is_active,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success(`${p.name} updated.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update.");
    }
    setSavingProduct(null);
  };

  const updateProduct = (id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  return (
    <div className="space-y-6">
      {/* Cashfree payment mode */}
      <Card className={cashfreeTestMode ? "border-amber-400" : "border-green-500"}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            {cashfreeTestMode ? (
              <FlaskConical className="h-4 w-4 text-amber-500" />
            ) : (
              <ShieldCheck className="h-4 w-4 text-green-600" />
            )}
            Cashfree Payment Mode
            <span
              className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                cashfreeTestMode
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {cashfreeTestMode ? "TEST" : "PRODUCTION"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            {cashfreeTestMode
              ? "Payments are going through the Cashfree sandbox. No real money is charged. Switch to Production before going live."
              : "Payments are live. Real money is being charged. Switch to Test mode for development/testing."}
          </p>
          <Button
            variant={cashfreeTestMode ? "default" : "outline"}
            size="sm"
            onClick={handleToggleCashfreeMode}
            disabled={savingCashfreeMode}
            className={cashfreeTestMode ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
          >
            {savingCashfreeMode ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
            {cashfreeTestMode ? "Switch to Production" : "Switch to Test Mode"}
          </Button>
        </CardContent>
      </Card>

      {/* Homepage stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Homepage Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Students Placed</Label>
              <Input
                value={stats.students_placed}
                onChange={(e) =>
                  setStats((s) => ({ ...s, students_placed: e.target.value }))
                }
                placeholder="500+"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Avg Salary Hike</Label>
              <Input
                value={stats.avg_hike}
                onChange={(e) =>
                  setStats((s) => ({ ...s, avg_hike: e.target.value }))
                }
                placeholder="45%"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Companies Hiring</Label>
              <Input
                value={stats.companies_hiring}
                onChange={(e) =>
                  setStats((s) => ({ ...s, companies_hiring: e.target.value }))
                }
                placeholder="80+"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Success Rate</Label>
              <Input
                value={stats.success_rate}
                onChange={(e) =>
                  setStats((s) => ({ ...s, success_rate: e.target.value }))
                }
                placeholder="94%"
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Next Batch Date</Label>
              <Input
                type="date"
                value={batchDate}
                onChange={(e) => setBatchDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>WhatsApp Link</Label>
              <Input
                value={whatsappLink}
                onChange={(e) => setWhatsappLink(e.target.value)}
                placeholder="https://wa.me/91..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3 py-1">
            <input
              type="checkbox"
              id="show_gst"
              checked={showGst}
              onChange={(e) => setShowGst(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="show_gst" className="cursor-pointer">
              Add GST (18%) to prices
              <span className="block text-xs font-normal text-muted-foreground">
                When unchecked, GST is not added or shown anywhere on the site
              </span>
            </Label>
          </div>

          <Button onClick={handleSaveSettings} disabled={savingSettings}>
            {savingSettings ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            {savingSettings ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>

      {/* Product pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Product Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {products.map((p, i) => (
            <div key={p.id}>
              {i > 0 && <Separator className="mb-4" />}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{p.name}</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`active_${p.id}`}
                      checked={p.is_active}
                      onChange={(e) =>
                        updateProduct(p.id, { is_active: e.target.checked })
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`active_${p.id}`} className="text-sm font-normal">
                      Active
                    </Label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Price (₹)</Label>
                    <Input
                      type="number"
                      value={p.price_inr}
                      onChange={(e) =>
                        updateProduct(p.id, { price_inr: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Original Price (₹) - for strikethrough</Label>
                    <Input
                      type="number"
                      value={p.original_price ?? ""}
                      onChange={(e) =>
                        updateProduct(p.id, {
                          original_price: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                    />
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSaveProduct(p)}
                  disabled={savingProduct === p.id}
                >
                  {savingProduct === p.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : null}
                  {savingProduct === p.id ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
