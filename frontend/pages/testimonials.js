import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function Testimonials() {
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

    setTestimonials(testimonialImages);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-blue-100 mb-6 transition"
          >
            <FiArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Student Success Stories
          </h1>
          <p className="text-xl text-blue-100">
            Our students have successfully placed in top product-based companies
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Real students, real placements, real success
            </p>
          </div>

          {/* Grid of Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((image, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2"
              >
                <img
                  src={`/stories/${image}`}
                  alt={`Student testimonial ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Be Our Next Success Story?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join our bootcamp and land your dream job at top product companies
          </p>
          <Link
            href="/login?redirect=/payment"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
          >
            Enroll Now
          </Link>
        </div>
      </section>
    </Layout>
  );
}

