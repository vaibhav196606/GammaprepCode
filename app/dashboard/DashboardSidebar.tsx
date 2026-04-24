"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileSearch, LayoutDashboard, Rocket, Settings, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Props {
  name: string;
  enrolledSlugs: string[];
  isAdmin: boolean;
}

const ALL_PRODUCTS = [
  {
    slug: "career_audit",
    href: "/dashboard/career-audit",
    label: "Career Audit",
    icon: FileSearch,
  },
  {
    slug: "interview_sprint",
    href: "/dashboard/interview-sprint",
    label: "Interview Sprint",
    icon: Rocket,
  },
  {
    slug: "placement_mentorship",
    href: "/dashboard/placement-mentorship",
    label: "Placement Mentorship",
    icon: Trophy,
  },
];

export default function DashboardSidebar({ name, enrolledSlugs, isAdmin }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background py-6 px-4 space-y-1 shrink-0">
      {/* User greeting */}
      <div className="px-3 pb-4 mb-2 border-b">
        <div className="text-xs text-muted-foreground">Signed in as</div>
        <div className="font-semibold truncate">{name}</div>
      </div>

      {/* Overview */}
      <Link
        href="/dashboard"
        className={cn(
          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          pathname === "/dashboard"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <LayoutDashboard className="h-4 w-4" />
        Overview
      </Link>

      {/* Products */}
      <div className="pt-3 pb-1">
        <div className="text-xs font-semibold text-muted-foreground px-3 mb-1 uppercase tracking-wide">
          My Products
        </div>
      </div>

      {ALL_PRODUCTS.map((product) => {
        const enrolled = enrolledSlugs.includes(product.slug);
        const Icon = product.icon;
        const active = pathname.startsWith(product.href);

        if (!enrolled) return null;

        return (
          <Link
            key={product.slug}
            href={product.href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4" />
            {product.label}
          </Link>
        );
      })}

      {/* Not enrolled products */}
      {ALL_PRODUCTS.filter((p) => !enrolledSlugs.includes(p.slug)).length > 0 && (
        <div className="pt-3 pb-1">
          <div className="text-xs font-semibold text-muted-foreground px-3 mb-1 uppercase tracking-wide">
            Upgrade
          </div>
          {ALL_PRODUCTS.filter((p) => !enrolledSlugs.includes(p.slug)).map(
            (product) => {
              const Icon = product.icon;
              const href = `/products/${product.slug.replace(/_/g, "-")}`;
              return (
                <Link
                  key={product.slug}
                  href={href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Icon className="h-4 w-4 opacity-50" />
                  {product.label}
                  <Badge variant="outline" className="ml-auto text-xs py-0">
                    Get
                  </Badge>
                </Link>
              );
            }
          )}
        </div>
      )}

      {/* Settings at bottom */}
      <div className="mt-auto pt-4 border-t">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/dashboard/settings"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Admin Panel ↗
          </Link>
        )}
      </div>
    </aside>
  );
}
