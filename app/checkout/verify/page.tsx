"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SLUG_TO_DASHBOARD: Record<string, string> = {
  career_audit: "/dashboard/career-audit",
  interview_sprint: "/dashboard/interview-sprint",
  placement_mentorship: "/dashboard/placement-mentorship",
};

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [status, setStatus] = useState<"loading" | "success" | "failed" | "pending">("loading");
  const [productSlug, setProductSlug] = useState<string>("");
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const data = await res.json();

        if (data.status === "PAID") {
          setProductSlug(data.productSlug ?? "");
          setStatus("success");
          setTimeout(() => {
            router.push(SLUG_TO_DASHBOARD[data.productSlug ?? ""] ?? "/dashboard");
          }, 3000);
        } else if (data.status === "PENDING" && attemptsRef.current < 5) {
          setStatus("pending");
          attemptsRef.current += 1;
          setTimeout(verify, 2000);
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    };

    verify();
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-start md:items-center justify-center p-8 pt-16 md:pt-8">
      <div className="text-center max-w-md space-y-6">
        {(status === "loading" || status === "pending") && (
          <>
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Verifying your payment...</h1>
            <p className="text-muted-foreground">
              Please wait while we confirm your payment. Do not close this page.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Payment successful! 🎉</h1>
            <p className="text-muted-foreground">
              You&apos;re now enrolled. Redirecting you to your dashboard in a
              moment...
            </p>
            <Link href={SLUG_TO_DASHBOARD[productSlug] ?? "/dashboard"}>
              <Button>Go to Dashboard</Button>
            </Link>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Payment failed</h1>
            <p className="text-muted-foreground">
              Your payment could not be completed. If any amount was deducted,
              it will be refunded automatically within 5–7 business days.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                className="w-full"
                onClick={() => router.back()}
              >
                Try Again
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
              <a
                href="https://wa.me/918890240404"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" className="w-full">Contact Support</Button>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-start md:items-center justify-center pt-16 md:pt-0">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
