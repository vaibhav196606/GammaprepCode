import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Received — Gammaprep",
  robots: { index: false, follow: false },
};

function getReplyByDate() {
  const date = new Date();
  let added = 0;
  while (added < 3) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function SubmittedPage() {
  const replyBy = getReplyByDate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 py-16">
        <div className="text-6xl">✅</div>
        <h1 className="text-3xl font-bold">Application received</h1>
        <p className="text-muted-foreground text-lg">
          Our team reviews every application personally.
          Expect a response by <strong>{replyBy}</strong>.
        </p>
        <p className="text-sm text-muted-foreground">
          We&apos;ll email you with our decision. If selected, you&apos;ll receive an invite to complete enrollment.
        </p>

        <div className="pt-4 space-y-3">
          <Link href="/dashboard" className="block">
            <Button className="w-full" size="lg">Go to Dashboard</Button>
          </Link>
          <a
            href="https://wa.me/918890240404"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="outline" className="w-full">
              Any questions? Chat on WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
