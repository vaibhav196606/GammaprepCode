import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Gammaprep account.",
  robots: { index: false, follow: false },
};

export default function LoginPage({
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
            Your next big career move starts here.
          </h2>
          <p className="text-white/80 text-lg">
            Join 3000+ engineers who got interview-ready and landed their dream roles.
          </p>
          <div className="mt-10 space-y-4">
            {[
              "Resume & LinkedIn audit by experts",
              "Structured interview prep system",
              "Mock interviews with real feedback",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 flex-shrink-0">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                </div>
                <span className="text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-start md:items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href={`/register${searchParams.redirect ? `?redirect=${searchParams.redirect}` : ""}`}
                className="text-primary font-medium hover:underline"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          <LoginForm redirect={searchParams.redirect} />
        </div>
      </div>
    </div>
  );
}
