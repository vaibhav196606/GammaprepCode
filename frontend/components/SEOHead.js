import Head from 'next/head';

export default function SEOHead({
  title = 'Gammaprep - Crack SDE/MLE Interviews at Top Product Companies',
  description = 'Join Gammaprep Live Classes Bootcamp for comprehensive placement preparation. Learn DSA, System Design, Data Science & Machine Learning. 100% placement assistance with assured job referrals.',
  keywords = 'gammaprep, placement bootcamp, coding interview, SDE interview preparation, MLE preparation, DSA course, System Design, Machine Learning, Data Science, job placement, tech interview, FAANG preparation, product companies',
  ogImage = 'https://gammaprep-project.vercel.app/og-image.jpg',
  url = 'https://gammaprep-project.vercel.app'
}) {
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Gamma Tech & Services LLP" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Gammaprep" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#667eea" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Structured Data - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Gammaprep",
            "legalName": "Gamma Tech & Services LLP",
            "url": "https://gammaprep-project.vercel.app",
            "logo": "https://gammaprep-project.vercel.app/logo.png",
            "foundingDate": "2024",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "SY.35P&36 2, Mytri Square, 41/11, Gachibowli - Miyapur Rd, Kondapur",
              "addressLocality": "Hyderabad",
              "addressRegion": "Telangana",
              "postalCode": "500084",
              "addressCountry": "IN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-8890240404",
              "contactType": "Customer Service",
              "email": "info@gammaprep.com",
              "areaServed": "IN",
              "availableLanguage": ["English", "Hindi"]
            },
            "sameAs": [
              "https://wa.me/918890240404"
            ]
          })
        }}
      />

      {/* Structured Data - Educational Course */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "Gammaprep Live Classes Bootcamp",
            "description": "Comprehensive placement preparation bootcamp covering DSA, System Design (HLD & LLD), Data Science & Machine Learning",
            "provider": {
              "@type": "Organization",
              "name": "Gammaprep",
              "sameAs": "https://gammaprep-project.vercel.app"
            },
            "educationalLevel": "Professional Development",
            "courseCode": "GAMMAPREP-001",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "Online",
              "courseWorkload": "PT20W",
              "instructor": {
                "@type": "Person",
                "name": "Industry Experts"
              }
            },
            "about": [
              "Data Structures and Algorithms",
              "System Design",
              "Machine Learning",
              "Data Science",
              "Interview Preparation"
            ],
            "teaches": [
              "DSA (8 weeks)",
              "System Design - HLD & LLD (4 weeks)",
              "Data Science with ML (8 weeks)",
              "Mock Interviews",
              "Resume Building"
            ],
            "offers": {
              "@type": "Offer",
              "category": "Paid",
              "priceCurrency": "INR"
            }
          })
        }}
      />
    </Head>
  );
}

