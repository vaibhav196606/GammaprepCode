"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Faq {
  id: string;
  question: string;
  answer: string;
  product_id: string | null;
  sort_order: number;
  products: { slug: string; name: string } | null;
}

interface Product {
  id: string;
  slug: string;
  name: string;
}

interface Props {
  faqs: Faq[];
  products: Product[];
}

const emptyForm = { question: "", answer: "", product_id: "", sort_order: "0" };

export default function FaqsManager({ faqs: initial, products }: Props) {
  const [faqs, setFaqs] = useState<Faq[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (f: Faq) => {
    setEditingId(f.id);
    setForm({
      question: f.question,
      answer: f.answer,
      product_id: f.product_id ?? "",
      sort_order: String(f.sort_order),
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.question || !form.answer) {
      toast.error("Question and answer are required.");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/faqs/${editingId}` : "/api/admin/faqs";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: form.question,
          answer: form.answer,
          product_id: form.product_id || null,
          sort_order: Number(form.sort_order),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const productObj = products.find((p) => p.id === (form.product_id || null)) ?? null;

      if (editingId) {
        setFaqs((prev) =>
          prev.map((f) =>
            f.id === editingId
              ? {
                  ...f,
                  question: form.question,
                  answer: form.answer,
                  product_id: form.product_id || null,
                  sort_order: Number(form.sort_order),
                  products: productObj
                    ? { slug: productObj.slug, name: productObj.name }
                    : null,
                }
              : f
          )
        );
        toast.success("FAQ updated.");
      } else {
        setFaqs((prev) => [...prev, data.faq]);
        toast.success("FAQ created.");
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      toast.success("FAQ deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete.");
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {editingId ? "Edit FAQ" : "New FAQ"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Question</Label>
              <Input
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                placeholder="What is included in the Career Audit?"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Answer</Label>
              <Textarea
                value={form.answer}
                onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                placeholder="The Career Audit includes..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Product (blank = general)</Label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.product_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, product_id: e.target.value }))
                  }
                >
                  <option value="">General</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sort_order: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {faqs.length === 0 ? (
          <div className="rounded-xl border bg-background px-4 py-8 text-center text-muted-foreground text-sm">
            No FAQs yet. Add one above.
          </div>
        ) : (
          faqs.map((f) => (
            <div
              key={f.id}
              className="rounded-xl border bg-background px-4 py-3 flex items-start gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{f.question}</div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {f.answer}
                </div>
                {f.products && (
                  <div className="text-xs text-primary mt-1">{f.products.name}</div>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(f)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(f.id)}
                  disabled={deletingId === f.id}
                >
                  {deletingId === f.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
