"use client";


import { motion } from "motion/react";
import FeaturesBentoGrid from '@/app/components/FeaturesBentoGrid'
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardPath, signInPath } from "@/routes/api/client";

export default function HeroSectionOne() {
  const { user } = useUser();
  const router = useRouter();

  const handleExploreNow = () => {
    if (user) {
      window.location.assign(dashboardPath());
    } else {
      window.location.assign(signInPath());
    }
  };

  return (
    <div className="relative mb-10 flex flex-col items-center justify-center">
      <Navbar />
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"🩺 Revolutionalize Patient care with AI Voice Agents"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                {...({
                  initial: { opacity: 0, filter: "blur(4px)", y: 10 },
                  animate: { opacity: 1, filter: "blur(0px)", y: 0 },
                  transition: {
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  },
                } as any)}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          {...({
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: {
              duration: 0.3,
              delay: 0.8,
            },
          } as any)}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Deliver instant, accurate medical assistance through material voice conversations. Automate appointment sheduling, symptom triage, and follow-up care-24/7.
        </motion.p>
        <motion.div
          {...({
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: {
              duration: 0.3,
              delay: 1,
            },
          } as any)}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button 
            onClick={handleExploreNow}
            className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Explore Now
          </button>
        </motion.div>
        <motion.div
          {...({
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: {
              duration: 0.3,
              delay: 1.2,
            },
          } as any)}
          className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <img
              src="https://assets.aceternity.com/pro/aceternity-landing.webp"
              alt="Landing page preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1000}
            />
          </div>
        </motion.div>
      </div>
      <FeaturesBentoGrid />
      <Footer />
    </div >
  );
}

const Navbar = () => {
  const { user } = useUser()
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-base font-bold md:text-2xl">Medical Care Dev X</h1>
      </Link>
      
      {/* Navigation Menu */}
      <div className="hidden md:flex gap-7 items-center">
        <Link href="/">
          <h2 className="text-sm md:text-base hover:font-bold cursor-pointer transition-all">Home</h2>
        </Link>
        <Link href="/dashboard">
          <h2 className="text-sm md:text-base hover:font-bold cursor-pointer transition-all">Dashboard</h2>
        </Link>
        <Link href="/about-us">
          <h2 className="text-sm md:text-base hover:font-bold cursor-pointer transition-all">About us</h2>
        </Link>
        <Link href="/contact-us">
          <h2 className="text-sm md:text-base hover:font-bold cursor-pointer transition-all">Contact us</h2>
        </Link>
      </div>
      
      {/* Login/User Button */}
      {
        !user ?
          <Link href="/auth/sign-in">
            <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Login
            </button>
          </Link>
          :
          <div className="flex gap-5 items-center">
            <UserButton />
          </div>
      }
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className='bg-gray-50 border-t w-full mt-20'>
      <div className='px-4 md:px-20 lg:px-40 py-10'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand Section */}
          <div className='col-span-1'>
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
              <h1 className="text-base font-bold md:text-xl">Medical Care Dev X</h1>
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
  );
};
