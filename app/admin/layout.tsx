import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/career-audits", label: "Career Audits" },
  { href: "/admin/mentorship-applications", label: "Applications" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/sprint", label: "Sprint Sessions" },
  { href: "/admin/promo-codes", label: "Promo Codes" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
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

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r bg-background py-6 px-3 space-y-1 shrink-0">
        <div className="px-3 pb-4 mb-2 border-b">
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Admin Panel
          </div>
        </div>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {item.label}
          </Link>
        ))}
        <div className="mt-auto pt-4 border-t">
          <Link
            href="/dashboard"
            className="flex items-center px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto bg-muted/10">
        {children}
      </main>
    </div>
  );
}
