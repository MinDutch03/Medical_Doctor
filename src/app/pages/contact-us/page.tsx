'use client'
import React, { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Textarea } from '@/app/components/ui/textarea'
import { sendContactAction } from '@/app/actions/contact'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import AppHeader from '../dashboard/_components/AppHeader'
import AppFooter from '../dashboard/_components/AppFooter'

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await sendContactAction({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      })
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AppHeader />
      <div className='max-w-4xl mx-auto px-4 py-10'>
      <h1 className='text-4xl font-bold mb-8'>Contact Us</h1>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
        {/* Contact Information */}
        <div className='space-y-6'>
          <div>
            <h2 className='text-2xl font-semibold mb-6'>Get in Touch</h2>
            <p className='text-gray-700 mb-6'>
              Have questions or feedback? We'd love to hear from you. Reach out to us through any of the following channels.
            </p>
          </div>

          <div className='space-y-4'>
            <div className='p-4 bg-gray-50 rounded-lg'>
              <h3 className='font-semibold mb-1'>Email</h3>
              <p className='text-gray-600'>support@medicalcare.com</p>
              <p className='text-gray-600'>info@medicalcare.com</p>
            </div>

            <div className='p-4 bg-gray-50 rounded-lg'>
              <h3 className='font-semibold mb-1'>Phone</h3>
              <p className='text-gray-600'>+1 (555) 123-4567</p>
              <p className='text-gray-600'>Available 24/7</p>
            </div>

            <div className='p-4 bg-gray-50 rounded-lg'>
              <h3 className='font-semibold mb-1'>Office Hours</h3>
              <p className='text-gray-600'>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className='text-gray-600'>Saturday - Sunday: 10:00 AM - 4:00 PM</p>
            </div>

            <div className='p-4 bg-gray-50 rounded-lg'>
              <h3 className='font-semibold mb-1'>Address</h3>
              <p className='text-gray-600'>
                123 Medical Tech Plaza<br />
                Healthcare District<br />
                San Francisco, CA 94102<br />
                United States
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className='text-2xl font-semibold mb-6'>Send us a Message</h2>
          
          {success && (
            <div className='mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800'>
              <p className='font-semibold'>✓ Message sent successfully!</p>
              <p className='text-sm mt-1'>We'll get back to you soon.</p>
            </div>
          )}

          {error && (
            <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800'>
              <p className='font-semibold'>✗ Error</p>
              <p className='text-sm mt-1'>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label htmlFor='name' className='block text-sm font-medium mb-2'>
                Your Name
              </label>
              <input
                type='text'
                id='name'
                value={formData.name}
                onChange={handleChange}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your name'
              />
            </div>

            <div>
              <label htmlFor='email' className='block text-sm font-medium mb-2'>
                Email Address
              </label>
              <input
                type='email'
                id='email'
                value={formData.email}
                onChange={handleChange}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your email'
              />
            </div>

            <div>
              <label htmlFor='subject' className='block text-sm font-medium mb-2'>
                Subject
              </label>
              <input
                type='text'
                id='subject'
                value={formData.subject}
                onChange={handleChange}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='What is this about?'
              />
            </div>

            <div>
              <label htmlFor='message' className='block text-sm font-medium mb-2'>
                Message
              </label>
              <Textarea
                id='message'
                value={formData.message}
                onChange={handleChange}
                required
                className='w-full min-h-[150px]'
                placeholder='Enter your message here...'
              />
            </div>

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? <><Loader2 className="animate-spin mr-2" /> Sending...</> : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>

      {/* Additional Information */}
      <div className='mt-12 p-6 bg-blue-50 rounded-lg'>
        <h3 className='font-semibold mb-2'>Need Immediate Assistance?</h3>
        <p className='text-gray-700'>
          For urgent medical concerns, please contact your local emergency services immediately or dial 115.
          Our AI consultation service is designed for non-emergency medical advice and should not replace emergency medical care.
        </p>
      </div>
      </div>
      <AppFooter />
    </>
  )
}

export default ContactUs

