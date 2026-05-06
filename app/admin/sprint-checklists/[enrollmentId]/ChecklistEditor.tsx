"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, CheckCircle2 } from "lucide-react";

interface Item {
  id: string;
  day_number: number;
  title: string;
  description: string | null;
  sort_order: number;
  completed: boolean;
}

interface Props {
  enrollmentId: string;
  userId: string;
  initialItems: Item[];
}

const DAYS = Array.from({ length: 21 }, (_, i) => i + 1);

const emptyForm = { title: "", description: "" };

export default function ChecklistEditor({
  enrollmentId,
  userId,
  initialItems,
}: Props) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map: Record<number, Item[]> = {};
    items.forEach((it) => {
      (map[it.day_number] ??= []).push(it);
    });
    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => a.sort_order - b.sort_order)
    );
    return map;
  }, [items]);

  const totalDone = items.filter((i) => i.completed).length;

  const openCreate = (day: number) => {
    setEditingId(null);
    setOpenDay(day);
    setForm(emptyForm);
  };

  const openEdit = (it: Item) => {
    setEditingId(it.id);
    setOpenDay(it.day_number);
    setForm({ title: it.title, description: it.description ?? "" });
  };

  const closeForm = () => {
    setEditingId(null);
    setOpenDay(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (openDay === null) return;
    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(
          `/api/admin/sprint-checklists/items/${editingId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: form.title.trim(),
              description: form.description.trim() || null,
              day_number: openDay,
            }),
          }
        );
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setItems((prev) =>
          prev.map((x) =>
            x.id === editingId
              ? {
                  ...x,
                  title: form.title.trim(),
                  description: form.description.trim() || null,
                  day_number: openDay,
                }
              : x
          )
        );
        toast.success("Item updated.");
      } else {
        const sort_order = (grouped[openDay]?.length ?? 0);
        const res = await fetch(`/api/admin/sprint-checklists/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            enrollment_id: enrollmentId,
            user_id: userId,
            day_number: openDay,
            title: form.title.trim(),
            description: form.description.trim() || null,
            sort_order,
          }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setItems((prev) => [...prev, data.item as Item]);
        toast.success("Item added.");
      }
      closeForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/sprint-checklists/items/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setItems((prev) => prev.filter((x) => x.id !== id));
      toast.success("Item deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete.");
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-3 text-sm">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="font-medium">
            {totalDone} of {items.length} completed
          </span>
          <span className="text-muted-foreground ml-auto">
            {items.length === 0
              ? "No tasks yet — add some below"
              : "Items below are visible on the student's dashboard"}
          </span>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {DAYS.map((day) => {
          const dayItems = grouped[day] ?? [];
          const isFormOpen = openDay === day;
          return (
            <Card key={day}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  Day {day}
                  {dayItems.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {dayItems.length} item
                      {dayItems.length === 1 ? "" : "s"}
                    </Badge>
                  )}
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => (isFormOpen ? closeForm() : openCreate(day))}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add item
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {dayItems.length === 0 && !isFormOpen && (
                  <div className="text-xs text-muted-foreground py-2">
                    No items for this day.
                  </div>
                )}
                {dayItems.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium flex items-center gap-2">
                        {it.title}
                        {it.completed && (
                          <Badge variant="success" className="text-xs">
                            Done
                          </Badge>
                        )}
                      </div>
                      {it.description && (
                        <div className="text-xs text-muted-foreground mt-0.5 whitespace-pre-wrap">
                          {it.description}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(it)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(it.id)}
                        disabled={deletingId === it.id}
                      >
                        {deletingId === it.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
                {isFormOpen && (
                  <div className="space-y-3 p-3 rounded-lg border bg-background">
                    <div className="space-y-1.5">
                      <Label>Title</Label>
                      <Input
                        value={form.title}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, title: e.target.value }))
                        }
                        placeholder="e.g. Polish resume bullet points"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Description (optional)</Label>
                      <Textarea
                        value={form.description}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Any extra context for the student"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={saving} size="sm">
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : null}
                        {saving
                          ? "Saving..."
                          : editingId
                          ? "Save changes"
                          : "Add item"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={closeForm}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
