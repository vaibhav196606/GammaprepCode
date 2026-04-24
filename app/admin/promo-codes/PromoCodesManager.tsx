"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";

interface PromoCode {
  id: string;
  code: string;
  discount_pct: number;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  product_id: string | null;
  products: { slug: string; name: string } | null;
}

interface Product {
  id: string;
  slug: string;
  name: string;
}

interface Props {
  promoCodes: PromoCode[];
  products: Product[];
}

const emptyForm = {
  code: "",
  discount_pct: "",
  max_uses: "",
  valid_from: "",
  valid_until: "",
  product_id: "",
  is_active: true,
};

export default function PromoCodesManager({ promoCodes: initial, products }: Props) {
  const [codes, setCodes] = useState<PromoCode[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!form.code || !form.discount_pct) {
      toast.error("Code and discount % are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          discount_pct: Number(form.discount_pct),
          max_uses: form.max_uses ? Number(form.max_uses) : null,
          valid_from: form.valid_from || null,
          valid_until: form.valid_until || null,
          product_id: form.product_id || null,
          is_active: form.is_active,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCodes((prev) => [data.promoCode, ...prev]);
      setForm(emptyForm);
      setShowForm(false);
      toast.success("Promo code created.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promo code?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/promo-codes/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCodes((prev) => prev.filter((c) => c.id !== id));
      toast.success("Promo code deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete.");
    }
    setDeletingId(null);
  };

  const toggleActive = async (code: PromoCode) => {
    setTogglingId(code.id);
    try {
      const res = await fetch(`/api/admin/promo-codes/${code.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !code.is_active }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCodes((prev) =>
        prev.map((c) => (c.id === code.id ? { ...c, is_active: !code.is_active } : c))
      );
    } catch (err) {
      toast.error("Failed to update.");
    }
    setTogglingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          New Code
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">New Promo Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Code</Label>
                <Input
                  value={form.code}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                  }
                  placeholder="LAUNCH50"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Discount %</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={form.discount_pct}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, discount_pct: e.target.value }))
                  }
                  placeholder="20"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Max Uses (blank = unlimited)</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.max_uses}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, max_uses: e.target.value }))
                  }
                  placeholder="100"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Product (blank = all products)</Label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.product_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, product_id: e.target.value }))
                  }
                >
                  <option value="">All products</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Valid From</Label>
                <Input
                  type="datetime-local"
                  value={form.valid_from}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, valid_from: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Valid Until</Label>
                <Input
                  type="datetime-local"
                  value={form.valid_until}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, valid_until: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active_form"
                checked={form.is_active}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_active: e.target.checked }))
                }
                className="h-4 w-4"
              />
              <Label htmlFor="is_active_form">Active immediately</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {saving ? "Creating..." : "Create"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="overflow-x-auto rounded-xl border bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Code</th>
              <th className="px-4 py-3 text-left font-medium">Discount</th>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">Uses</th>
              <th className="px-4 py-3 text-left font-medium">Valid Until</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No promo codes yet.
                </td>
              </tr>
            ) : (
              codes.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono font-medium">{c.code}</td>
                  <td className="px-4 py-3">{c.discount_pct}%</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.products?.name ?? "All products"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.used_count}
                    {c.max_uses ? ` / ${c.max_uses}` : ""}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.valid_until
                      ? new Date(c.valid_until).toLocaleDateString("en-IN")
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(c)}
                      disabled={togglingId === c.id}
                      className="cursor-pointer"
                    >
                      {c.is_active ? (
                        <Badge variant="success" className="text-xs">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(c.id)}
                      disabled={deletingId === c.id}
                    >
                      {deletingId === c.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
