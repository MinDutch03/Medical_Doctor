"use client"
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios'
import { useUser } from '@clerk/nextjs';
import { UserDetailsContext } from '@/app/context/userDetailContext';
// Removed server action - using API route instead


export type UserDetailsType = {
  name: string,
  email: string,
  credits: number
}


export function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useUser()
  const [userDetail, setUserDetail] = useState<any>(undefined)

  const createNewUser = useCallback(async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to get or create user');
      const user = await response.json();
      console.log(user);
      setUserDetail(user);
    } catch (error) {
      console.error('Error getting or creating user:', error);
    }
  }, [])

  useEffect(() => {
    user && createNewUser()
  }, [user, createNewUser])
  return (
    <UserDetailsContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailsContext.Provider>
  )
}