import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your free Gammaprep account and start your career journey.",
  robots: { index: false, follow: false },
};

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12">
        <div className="text-white max-w-md">
          <div className="mb-8 inline-flex rounded-2xl bg-white/95 px-4 py-3 shadow-lg">
            <Image
              src="/gammaprep_logo_main.png"
              alt="Gammaprep"
              width={170}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Land your dream job in 21 days.
          </h2>
          <p className="text-white/80 text-lg">
            Start with a ₹499 Career Audit - get a clear picture of exactly what&apos;s blocking your interviews.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { label: "3000+", sublabel: "Engineers coached" },
              { label: "4.9 / 5", sublabel: "Average rating" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold">{stat.label}</div>
                <div className="text-white/70 text-sm">{stat.sublabel}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-white/60 text-sm">
            Mentored by an ex-Microsoft &amp; Oracle engineer — real experience, no fluff.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-start md:items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Create your account</h1>
            <p className="mt-2 text-muted-foreground">
              Already have an account?{" "}
              <Link
                href={`/login${searchParams.redirect ? `?redirect=${searchParams.redirect}` : ""}`}
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <RegisterForm redirect={searchParams.redirect} />
        </div>
      </div>
    </div>
  );
}
