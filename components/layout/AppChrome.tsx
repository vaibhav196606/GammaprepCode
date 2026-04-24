"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface AppChromeProps {
  children: React.ReactNode;
  user: { id: string; email?: string } | null;
  profile: { name: string; is_admin: boolean } | null;
}

const AUTH_ROUTES = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]);

export default function AppChrome({ children, user, profile }: AppChromeProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname ? AUTH_ROUTES.has(pathname) : false;

  if (isAuthRoute) {
    return (
      <>
        <Navbar user={user} profile={profile} />
        <main className="min-h-screen">{children}</main>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} profile={profile} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
