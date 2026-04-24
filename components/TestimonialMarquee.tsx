"use client";

import Image from "next/image";

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

export default function TestimonialMarquee() {
  const doubled = [...STORY_IMAGES, ...STORY_IMAGES];

  return (
    <div className="w-full overflow-hidden py-6">
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 60s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="flex marquee-track gap-4 w-max">
        {doubled.map((file, i) => (
          <div key={`${file}-${i}`} className="flex-shrink-0">
            <Image
              src={`/stories/${file}`}
              alt={`Student testimonial ${(i % STORY_IMAGES.length) + 1}`}
              width={320}
              height={400}
              className="h-64 sm:h-80 w-auto object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
