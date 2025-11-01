"use client"
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios'
import { useUser } from '@clerk/nextjs';
import { UserDetailsContext } from '@/app/context/userDetailContext';
import { getOrCreateUserAction } from '@/app/actions/users';


export type UserDetailsType = {
  name: string,
  email: string,
  credits: number
}


export function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useUser()
  const [userDetail, setUserDetail] = useState<any>(undefined)

  const createNewUser = useCallback(async () => {
    const user = await getOrCreateUserAction()
    console.log(user)
    setUserDetail(user)
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