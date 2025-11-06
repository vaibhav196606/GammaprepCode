import { useEffect, useState } from 'react';

export default function TestimonialMarquee() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // List of all testimonial images
    const testimonialImages = [
      '61d4772d9caf1.jpg',
      '61d477385877c.png',
      '61d47744e9da9.jpg',
      '61d477855998a.png',
      '61d49758955d0.png',
      '61d4976b75ff1.jpg',
      '61d497c871578.png',
      '61d497ddd08b4.png',
      '61d498038e576.png',
      '61d4986455e13.png',
      '61d498882f9ce.png',
      '61d498e12550e.png',
      '61d499579db37.png',
      '6213a4272fe6c.png',
      '621f52847a07b.png',
      '62ac61331f365.png',
      '645fc85e6dba3.png',
      '645fc89dbb30b.png',
      '645fc8afa067c.png',
      '645fc8bca1257.png',
      '645fc90d04317.png',
      '645fc94fc3b6f.png',
      '653e4621c9d3f.png',
    ];

    // Shuffle the array randomly using Fisher-Yates algorithm
    const shuffled = [...testimonialImages];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setTestimonials(shuffled);
  }, []);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 py-8">
            <style jsx>{`
              @keyframes scroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }

              .animate-scroll {
                animation: scroll 50s linear infinite;
              }
            `}</style>

      <div className="flex animate-scroll gap-4">
        {/* Duplicate the array twice for seamless infinite loop - shows all 23 testimonials */}
        {[...testimonials, ...testimonials].map((image, index) => (
          <div
            key={`testimonial-${index}`}
            className="flex-shrink-0"
          >
            <img
              src={`/stories/${image}`}
              alt={`Student testimonial ${(index % testimonials.length) + 1}`}
              className="h-64 sm:h-80 md:h-96 w-auto object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
