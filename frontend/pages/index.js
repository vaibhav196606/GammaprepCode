import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { FiCheck, FiCalendar, FiDollarSign, FiCheckCircle, FiTarget, FiUsers, FiAward } from 'react-icons/fi';
import TestimonialMarquee from '@/components/TestimonialMarquee';
import FAQSection from '@/components/FAQSection';
import SEOHead from '@/components/SEOHead';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Home() {
  const { user } = useAuth();
  const [courseInfo, setCourseInfo] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Fetch course info
    axios.get(`${API_URL}/api/course`)
      .then(res => setCourseInfo(res.data))
      .catch(err => console.error('Error fetching course info:', err));

    // Fetch testimonials from the URL
    fetch('https://gammaprep.com/Testimonials')
      .then(res => res.text())
      .then(html => {
        // Parse testimonials - this is a simple example
        // You might need to adjust based on the actual HTML structure
        setTestimonials([
          {
            name: 'Student 1',
            company: 'Amazon',
            text: 'Great bootcamp! Helped me crack my dream job.',
          },
          {
            name: 'Student 2',
            company: 'Google',
            text: 'Excellent teaching and comprehensive content.',
          },
          {
            name: 'Student 3',
            company: 'Microsoft',
            text: 'Best investment for my career.',
          },
        ]);
      })
      .catch(err => {
        console.error('Error fetching testimonials:', err);
        // Default testimonials
        setTestimonials([
          {
            name: 'Student 1',
            company: 'Amazon',
            text: 'Great bootcamp! Helped me crack my dream job.',
          },
          {
            name: 'Student 2',
            company: 'Google',
            text: 'Excellent teaching and comprehensive content.',
          },
          {
            name: 'Student 3',
            company: 'Microsoft',
            text: 'Best investment for my career.',
          },
        ]);
      });
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const syllabus = [
    {
      title: 'Data Structures & Algorithms',
      duration: '8 weeks',
      topics: [
        'Arrays, Strings, and Hashing',
        'Linked Lists, Stacks, and Queues',
        'Trees and Graphs',
        'Dynamic Programming',
        'Greedy Algorithms',
        'Backtracking and Recursion',
        'Searching and Sorting',
        'Advanced Problem Solving',
      ],
    },
    {
      title: 'System Design (HLD/LLD)',
      duration: '4 weeks',
      topics: [
        'System Design Fundamentals',
        'Scalability and Performance',
        'Database Design',
        'Microservices Architecture',
        'Caching and Load Balancing',
        'Low-Level Design Patterns',
        'Case Studies (Netflix, Uber, etc.)',
      ],
    },
    {
      title: 'Data Science & Machine Learning',
      duration: '4 weeks',
      topics: [
        'Python for Data Science',
        'Statistics and Probability',
        'Machine Learning Algorithms',
        'Deep Learning Basics',
        'Model Evaluation and Deployment',
        'ML System Design',
      ],
    },
  ];

  const companies = [
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
    { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { name: 'Uber', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg' },
    { name: 'Adobe', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Adobe_Corporate_logo.svg' },
    { name: 'Salesforce', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg' },
    { name: 'Oracle', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg' },
  ];

  return (
      <>
      <SEOHead />
      <Layout>
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  Land Your Dream Job as SDE/ML Engineer in <span className="text-primary">90 Days</span>
                </h1>
              </div>

              <h2 className="text-xl md:text-2xl font-semibold mb-8" style={{ color: '#00BCD4' }}>
                Live Classes Bootcamp • Assured Job Referrals at Top MNCs
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <FiCheckCircle className="text-white" size={18} />
                    </div>
                  </div>
                  <p className="text-lg text-gray-800 font-medium">Enroll with us.</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <FiCheckCircle className="text-white" size={18} />
                    </div>
                  </div>
                  <p className="text-lg text-gray-800 font-medium">Learn coding from the best mentors.</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <FiCheckCircle className="text-white" size={18} />
                    </div>
                  </div>
                  <p className="text-lg text-gray-800 font-medium">Make amazing projects.</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <FiCheckCircle className="text-white" size={18} />
                    </div>
                  </div>
                  <p className="text-lg text-gray-800 font-medium">Get Placed.</p>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-base font-medium text-gray-600">Fee:</span>
                  {courseInfo && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-gray-900">₹{courseInfo.price.toLocaleString()}/-</span>
                      {courseInfo.originalPrice && (
                        <span className="text-base text-gray-500 line-through">₹{courseInfo.originalPrice.toLocaleString()}/-</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-baseline gap-3">
                  <span className="text-base font-medium text-gray-600">Next Batch:</span>
                  {courseInfo && (
                    <span className="text-lg text-primary font-bold bg-blue-50 px-4 py-1 rounded-lg">
                      {formatDate(courseInfo.startDate)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {user ? (
                  user.isEnrolled ? (
                    <Link
                      href="/dashboard"
                      className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg text-center"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/payment"
                      className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg text-center"
                    >
                      Enroll Now
                    </Link>
                  )
                ) : (
                  <Link
                    href="/login?redirect=/payment"
                    className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg text-center"
                  >
                    Enroll Now
                  </Link>
                )}
                
                <a
                  href="https://wa.me/918890240404?text=Hi,%20I%20want%20to%20know%20more%20about%20gammaprep.com%20placement%20bootcamp%20course."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition shadow-lg"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Whatsapp Chat
                </a>
              </div>

              <div className="flex items-center gap-2 text-green-600">
                <FiCheckCircle size={20} />
                <span className="font-bold text-lg">Assured Job Referrals at Top MNCs</span>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <img
                  src="/hero-illustration.png"
                  alt="Student with Gamma Prep backpack looking at top tech companies - Goldman Sachs, Meta, Amazon, Google, Walmart, Apple, Microsoft"
                  className="w-full h-auto"
                  style={{ maxWidth: '600px', margin: '0 auto' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Our Students Work At
            </h2>
            <p className="text-gray-600">Top product-based companies where our alumni have been placed</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
            {companies.map((company, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition w-full h-24 flex items-center justify-center">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="max-w-full max-h-12 object-contain grayscale hover:grayscale-0 transition"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-primary mb-4 flex justify-center">
                <FiUsers size={48} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {courseInfo?.stats?.studentsEnrolled || 500}+
              </div>
              <div className="text-gray-600">Students Enrolled</div>
            </div>
            <div className="p-6">
              <div className="text-primary mb-4 flex justify-center">
                <FiAward size={48} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {courseInfo?.stats?.referralRate || 100}%
              </div>
              <div className="text-gray-600">Job Referral Rate</div>
            </div>
            <div className="p-6">
              <div className="text-primary mb-4 flex justify-center">
                <FiTarget size={48} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {courseInfo?.stats?.averagePackage || 15} LPA
              </div>
              <div className="text-gray-600">Average Package</div>
            </div>
            <div className="p-6">
              <div className="text-primary mb-4 flex justify-center">
                <FiCheckCircle size={48} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {courseInfo?.stats?.hiringPartners || 50}+
              </div>
              <div className="text-gray-600">Referring Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mentor Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Learn from Industry Expert
            </h2>
          </div>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Mentor Photo */}
              <div className="flex-shrink-0">
                <img
                  src="/mentor_vaibhav.png"
                  alt="Vaibhav Goyal - SDE2 at Microsoft"
                  className="w-48 h-48 rounded-2xl object-cover shadow-lg"
                />
              </div>
              
              {/* Mentor Info */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Vaibhav Goyal</h3>
                
                {/* Company Logos */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                  <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                      alt="Microsoft"
                      className="h-6 w-auto"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-gray-800">Microsoft</span>
                      <span className="text-sm font-semibold text-gray-600">• SDE2</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg"
                      alt="Oracle"
                      className="h-5 w-auto"
                    />
                    <span className="text-sm font-semibold text-gray-700">Ex-SDE</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Expert mentor conducting live interactive classes. With years of experience at Microsoft and Oracle,
                  Vaibhav provides hands-on training and helps students get referrals at top MNCs.
                </p>
                
                {/* LinkedIn Button */}
                <a
                  href="https://www.linkedin.com/in/vaibgoyl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Gammaprep?
            </h2>
            <p className="text-xl text-gray-600">The complete package for your dream career</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Live Interactive Classes</h3>
              <p className="text-gray-700">
                Learn through live classes with real-time problem-solving, doubt clearing, and direct interaction with mentors from top companies.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">💼</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Industry-Focused Curriculum</h3>
              <p className="text-gray-700">
                Learn exactly what top companies like Amazon, Google, and Microsoft look for in their candidates.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Assured Job Referrals</h3>
              <p className="text-gray-700">
                Get guaranteed referrals to top MNCs like Amazon, Microsoft, Google, Oracle, and more after completing the bootcamp.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Mock Interviews & Tests</h3>
              <p className="text-gray-700">
                Regular mock interviews and tests to evaluate your progress and prepare you for real company interviews with expert feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus Section */}
      <section id="syllabus" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Course Syllabus
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Comprehensive 16-week curriculum designed to make you interview-ready
            </p>
            {courseInfo && courseInfo.syllabusPdfUrl && (
              <a
                href={courseInfo.syllabusPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Detailed Syllabus (PDF)
              </a>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {syllabus.map((module, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-primary font-semibold mb-4">{module.duration}</p>
                <ul className="space-y-2">
                  {module.topics.map((topic, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FiCheck className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              Hear from our students who landed their dream jobs at top companies
            </p>
            <Link
              href="/testimonials"
              className="inline-block text-primary hover:text-blue-700 font-semibold"
            >
              View All Testimonials →
            </Link>
          </div>
        </div>

        {/* Auto-scrolling Testimonial Marquee */}
        <TestimonialMarquee />

        <div className="text-center mt-8">
          <Link
            href="/testimonials"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg"
          >
            See All Success Stories
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Join hundreds of successful students who transformed their careers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {user ? (
              user.isEnrolled ? (
                <Link
                  href="/dashboard"
                  className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/payment"
                  className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
                >
                  Enroll Now
                </Link>
              )
            ) : (
              <>
                <Link
                  href="/login?redirect=/payment"
                  className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
                >
                  Enroll Now
                </Link>
                <a
                  href="https://wa.me/918890240404?text=Hi,%20I%20want%20to%20know%20more%20about%20gammaprep.com%20placement%20bootcamp%20course."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition shadow-lg"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Chat with Us
                </a>
              </>
            )}
          </div>
          {courseInfo && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-blue-100">
              <div className="flex items-center gap-2">
                <FiCalendar size={24} />
                <span>Batch starts: {formatDate(courseInfo.startDate)}</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center gap-2">
                <FiUsers size={24} />
                <span>Limited seats available</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />
    </Layout>
    </>
  );
}

