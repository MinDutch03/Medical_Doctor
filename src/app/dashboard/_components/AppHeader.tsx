import { UserButton } from '@clerk/nextjs'
import React from 'react'
import Link from 'next/link'

const menuOptions = [
  {
    id: 1,
    name: "Home",
    path: "/"
  },
  {
    id: 2,
    name: 'Dashboard',
    path: '/dashboard'
  },
  {
    id: 3,
    name: 'About us',
    path: '/about-us'
  },
  {
    id: 4,
    name: 'Contact us',
    path: '/contact-us'
  }
]


function AppHeader() {
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-base font-bold md:text-xl">Medical Care Dev X</h1>
      </Link>
      <div className='hidden md:flex gap-7 items-center'>
        {menuOptions.map((option, index) => {
          return (
            <Link key={index} href={option.path}>
              <h2 className='text-sm md:text-base hover:font-bold cursor-pointer transition-all'>{option.name}</h2>
            </Link>
          )
        })}
      </div>
      <UserButton />
    </nav>
  )
}

export default AppHeader