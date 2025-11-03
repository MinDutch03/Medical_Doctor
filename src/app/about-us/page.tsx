import React from 'react'
import AppHeader from '../dashboard/_components/AppHeader'
import AppFooter from '../dashboard/_components/AppFooter'

function AboutUs() {
  return (
    <>
      <AppHeader />
      <div className='max-w-4xl mx-auto px-4 py-10'>
      <h1 className='text-4xl font-bold mb-8'>About Us</h1>
      
      <div className='space-y-8'>
        <section>
          <h2 className='text-2xl font-semibold mb-4'>Our Mission</h2>
          <p className='text-gray-700 leading-relaxed'>
            At Medical Care Dev X, we are dedicated to revolutionizing healthcare accessibility through innovative AI-powered solutions. Our mission is to make quality medical consultation available to everyone, anytime, anywhere.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4'>What We Offer</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='p-6 bg-gray-50 rounded-lg'>
              <h3 className='font-semibold mb-2'>AI-Powered Consultations</h3>
              <p className='text-gray-600'>
                Get instant medical advice from our advanced AI doctor agents specialized in various medical fields.
              </p>
            </div>
            <div className='p-6 bg-gray-50 rounded-lg'>
              <h3 className='font-semibold mb-2'>Real Doctor Support</h3>
              <p className='text-gray-600'>
                Connect with certified medical professionals when you need real-time expert consultation.
              </p>
            </div>
            <div className='p-6 bg-gray-50 rounded-lg'>
              <h3 className='font-semibold mb-2'>24/7 Availability</h3>
              <p className='text-gray-600'>
                Access our services round the clock, ensuring healthcare is always within reach.
              </p>
            </div>
            <div className='p-6 bg-gray-50 rounded-lg'>
              <h3 className='font-semibold mb-2'>Voice & Text Support</h3>
              <p className='text-gray-600'>
                Choose between voice or text-based interactions based on your convenience.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4'>Our Team</h2>
          <p className='text-gray-700 leading-relaxed'>
            Our team consists of experienced healthcare professionals, AI researchers, and technology experts working together to deliver the best medical consultation experience. We combine cutting-edge artificial intelligence with medical expertise to provide reliable, accessible healthcare solutions.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4'>Why Choose Us</h2>
          <ul className='space-y-3 text-gray-700'>
            <li className='flex items-start'>
              <span className='text-blue-600 mr-2'>✓</span>
              <span>Instant access to medical consultation</span>
            </li>
            <li className='flex items-start'>
              <span className='text-blue-600 mr-2'>✓</span>
              <span>Multiple specialist doctors available</span>
            </li>
            <li className='flex items-start'>
              <span className='text-blue-600 mr-2'>✓</span>
              <span>Secure and confidential consultation</span>
            </li>
            <li className='flex items-start'>
              <span className='text-blue-600 mr-2'>✓</span>
              <span>Free to use platform</span>
            </li>
            <li className='flex items-start'>
              <span className='text-blue-600 mr-2'>✓</span>
              <span>Easy-to-use interface</span>
            </li>
          </ul>
        </section>
      </div>
      </div>
      <AppFooter />
    </>
  )
}

export default AboutUs

