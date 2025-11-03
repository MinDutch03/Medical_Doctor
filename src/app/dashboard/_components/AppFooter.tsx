import Link from 'next/link'
import React from 'react'

function AppFooter() {
  return (
    <footer className='bg-gray-50 border-t mt-20'>
      <div className='px-10 md:px-20 lg:px-40 py-10'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand Section */}
          <div className='col-span-1'>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-6 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
              <h1 className="text-base font-bold">Medical Care Dev X</h1>
            </div>
            <p className='text-sm text-gray-600 mt-4'>
              Your trusted AI-powered medical consultation platform. Get expert advice from specialist doctors anytime, anywhere.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='font-bold mb-4'>Quick Links</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href="/" className='text-gray-600 hover:text-gray-900'>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className='text-gray-600 hover:text-gray-900'>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about-us" className='text-gray-600 hover:text-gray-900'>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className='text-gray-600 hover:text-gray-900'>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className='font-bold mb-4'>Services</h3>
            <ul className='space-y-2 text-sm'>
              <li className='text-gray-600'>General Consultation</li>
              <li className='text-gray-600'>Specialist Doctors</li>
              <li className='text-gray-600'>AI Voice Assistant</li>
              <li className='text-gray-600'>Real Doctor Calls</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className='font-bold mb-4'>Contact</h3>
            <ul className='space-y-2 text-sm text-gray-600'>
              <li>Email: support@medicalcare.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Hours: 24/7 Available</li>
            </ul>
          </div>
        </div>

        <div className='border-t mt-8 pt-6 text-center text-sm text-gray-600'>
          <p>&copy; {new Date().getFullYear()} Medical Care Dev X. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default AppFooter

