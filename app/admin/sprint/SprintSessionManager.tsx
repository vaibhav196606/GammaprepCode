"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { formatDate } from "@/lib/utils";

type SessionType = "group_session" | "mock_interview";

interface Session {
  id: string;
  title: string;
  session_type: SessionType;
  scheduled_at: string;
  meeting_link: string | null;
  recording_url: string | null;
  is_published: boolean;
}

interface Props {
  sessions: Session[];
  attendanceCounts: Record<string, number>;
}

const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  group_session: "Group Session",
  mock_interview: "Mock Interview",
};

const emptyForm = {
  title: "",
  session_type: "group_session" as SessionType,
  scheduled_at: "",
  meeting_link: "",
  recording_url: "",
  is_published: false,
};

export default function SprintSessionManager({ sessions: initial, attendanceCounts }: Props) {
  const [sessions, setSessions] = useState<Session[]>(initial);
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

  const openEdit = (s: Session) => {
    setEditingId(s.id);
    setForm({
      title: s.title,
      session_type: s.session_type,
      scheduled_at: s.scheduled_at.slice(0, 16),
      meeting_link: s.meeting_link ?? "",
      recording_url: s.recording_url ?? "",
      is_published: s.is_published,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.scheduled_at) {
      toast.error("Title and scheduled date are required.");
      return;
    }
    setSaving(true);
    try {
      const url = editingId
        ? `/api/admin/sprint/sessions/${editingId}`
        : "/api/admin/sprint/sessions";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          scheduled_at: new Date(form.scheduled_at).toISOString(),
          meeting_link: form.meeting_link || null,
          recording_url: form.recording_url || null,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (editingId) {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === editingId
              ? {
                  ...s,
                  ...form,
                  scheduled_at: new Date(form.scheduled_at).toISOString(),
                  meeting_link: form.meeting_link || null,
                  recording_url: form.recording_url || null,
                }
              : s
          )
        );
        toast.success("Session updated.");
      } else {
        setSessions((prev) => [data.session, ...prev]);
        toast.success("Session created.");
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this session?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/sprint/sessions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast.success("Session deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete.");
    }
    setDeletingId(null);
  };

  const togglePublish = async (s: Session) => {
    try {
      const res = await fetch(`/api/admin/sprint/sessions/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s, is_published: !s.is_published }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSessions((prev) =>
        prev.map((x) => (x.id === s.id ? { ...x, is_published: !s.is_published } : x))
      );
      toast.success(s.is_published ? "Session unpublished." : "Session published.");
    } catch (err) {
      toast.error("Failed to update.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Session
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {editingId ? "Edit Session" : "New Session"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Resume Deep Dive - Session 1"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.session_type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, session_type: e.target.value as SessionType }))
                  }
                >
                  <option value="group_session">Group Session</option>
                  <option value="mock_interview">Mock Interview</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Scheduled At</Label>
                <Input
                  type="datetime-local"
                  value={form.scheduled_at}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, scheduled_at: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Meeting Link</Label>
                <Input
                  value={form.meeting_link}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, meeting_link: e.target.value }))
                  }
                  placeholder="https://meet.google.com/..."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Recording URL</Label>
                <Input
                  value={form.recording_url}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, recording_url: e.target.value }))
                  }
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={form.is_published}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_published: e.target.checked }))
                }
                className="h-4 w-4"
              />
              <Label htmlFor="is_published">Publish immediately</Label>
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

      <div className="overflow-x-auto rounded-xl border bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Scheduled</th>
              <th className="px-4 py-3 text-left font-medium">Attended</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No sessions yet.
                </td>
              </tr>
            ) : (
              sessions.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{s.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {SESSION_TYPE_LABELS[s.session_type]}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(s.scheduled_at)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {attendanceCounts[s.id] ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    {s.is_published ? (
                      <Badge variant="success" className="text-xs">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Draft
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => togglePublish(s)}
                        title={s.is_published ? "Unpublish" : "Publish"}
                      >
                        {s.is_published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(s)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(s.id)}
                        disabled={deletingId === s.id}
                      >
                        {deletingId === s.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </div>
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
