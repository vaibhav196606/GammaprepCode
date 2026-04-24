import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import AppChrome from "@/components/layout/AppChrome";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://gammaprep.com"),
  title: {
    default: "Gammaprep - Career Coaching for Software Engineers",
    template: "%s | Gammaprep",
  },
  description:
    "Get interview-ready with expert career coaching. Resume audit, mock interviews, and placement mentorship for software engineers in India.",
  keywords: [
    "career coaching India",
    "interview preparation India",
    "software engineer jobs India",
    "resume review India",
    "mock interview India",
    "placement mentorship India",
    "career audit software engineer",
    "best interview coaching India",
    "FAANG preparation India",
    "DSA interview preparation India",
    "system design interview India",
    "software engineer placement coaching",
    "Vaibhav Goyal career coach",
    "Microsoft engineer career coaching",
    "product company placement India",
    "LinkedIn profile optimization India",
    "resume review software engineer India",
    "career mentor software engineer",
  ],
  authors: [
    { name: "Vaibhav Goyal", url: "https://www.linkedin.com/in/vaibgoyl/" },
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://gammaprep.com",
    siteName: "Gammaprep",
    title: "Gammaprep - Career Coaching for Software Engineers",
    description:
      "Get interview-ready with expert career coaching. Resume audit, mock interviews, and placement mentorship.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gammaprep - Career Coaching for Software Engineers",
    description:
      "Get interview-ready with expert career coaching for software engineers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  other: {
    "geo.region": "IN",
    "geo.country": "India",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("name, is_admin")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
        <AppChrome user={user} profile={profile}>
          {children}
        </AppChrome>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
