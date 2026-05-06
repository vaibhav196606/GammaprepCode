"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

interface Item {
  id: string;
  day_number: number;
  title: string;
  description: string | null;
  completed: boolean;
}

interface Props {
  initialItems: Item[];
}

export default function ChecklistView({ initialItems }: Props) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<number, Item[]>();
    items.forEach((it) => {
      if (!map.has(it.day_number)) map.set(it.day_number, []);
      map.get(it.day_number)!.push(it);
    });
    return map;
  }, [items]);

  const total = items.length;
  const done = items.filter((i) => i.completed).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const toggle = async (item: Item) => {
    const next = !item.completed;
    setPendingId(item.id);
    setItems((prev) =>
      prev.map((x) => (x.id === item.id ? { ...x, completed: next } : x))
    );
    try {
      const res = await fetch(
        `/api/dashboard/sprint-checklists/items/${item.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: next }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
    } catch (err) {
      setItems((prev) =>
        prev.map((x) =>
          x.id === item.id ? { ...x, completed: item.completed } : x
        )
      );
      toast.error(
        err instanceof Error ? err.message : "Failed to update."
      );
    }
    setPendingId(null);
  };

  if (total === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Your mentor hasn&apos;t set up your 21-day plan yet. Check back soon.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {done} of {total} completed
          </span>
          <span className="font-medium">{pct}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 21 }, (_, i) => i + 1).map((day) => {
          const dayItems = grouped.get(day);
          if (!dayItems || dayItems.length === 0) return null;
          return (
            <div key={day} className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Day {day}
              </div>
              <div className="space-y-2">
                {dayItems.map((it) => (
                  <label
                    key={it.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer ${
                      pendingId === it.id ? "opacity-60" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={it.completed}
                      onChange={() => toggle(it)}
                      disabled={pendingId === it.id}
                      className="h-4 w-4 mt-0.5 flex-shrink-0 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-medium ${
                          it.completed
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {it.title}
                      </div>
                      {it.description && (
                        <div className="text-xs text-muted-foreground mt-0.5 whitespace-pre-wrap">
                          {it.description}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
