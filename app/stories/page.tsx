import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Placement Screenshots & Proof | Gammaprep",
  description:
    "Real screenshots from Gammaprep students who got placed at top tech companies in India. Verified placement results at Amazon, Microsoft, Google, Deloitte, Zoho, Walmart, and more.",
  keywords: [
    "gammaprep placements proof",
    "gammaprep results screenshots",
    "software engineer placement India proof",
    "career coaching results India",
    "gammaprep success proof",
  ],
  alternates: {
    canonical: "https://gammaprep.com/stories",
  },
  openGraph: {
    title: "Student Placement Screenshots | Gammaprep",
    description:
      "Real screenshots from engineers who got placed after Gammaprep coaching. Verified results at top product companies.",
    url: "https://gammaprep.com/stories",
  },
};

const STORY_IMAGES = [
  "61d4772d9caf1.jpg",
  "61d477385877c.png",
  "61d47744e9da9.jpg",
  "61d477855998a.png",
  "61d49758955d0.png",
  "61d4976b75ff1.jpg",
  "61d497c871578.png",
  "61d497ddd08b4.png",
  "61d498038e576.png",
  "61d4986455e13.png",
  "61d498882f9ce.png",
  "61d498e12550e.png",
  "61d499579db37.png",
  "6213a4272fe6c.png",
  "621f52847a07b.png",
  "62ac61331f365.png",
  "645fc85e6dba3.png",
  "645fc89dbb30b.png",
  "645fc8afa067c.png",
  "645fc8bca1257.png",
  "645fc90d04317.png",
  "645fc94fc3b6f.png",
  "653e4621c9d3f.png",
];

export default function StoriesPage() {
  return (
    <main className="py-20 px-4">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">
            Student Success Stories
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Real screenshots from our students who landed offers at top tech
            companies.
          </p>
        </div>

        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {STORY_IMAGES.map((file, i) => (
            <div key={file} className="break-inside-avoid">
              <Image
                src={`/stories/${file}`}
                alt={`Gammaprep student placement proof — verified offer screenshot ${i + 1}`}
                width={400}
                height={500}
                className="w-full rounded-xl shadow-md object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
