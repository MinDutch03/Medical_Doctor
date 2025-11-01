'use client'
import { Button } from '@/app/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
import Image from 'next/image'
import React, { useState } from 'react'
import axios from 'axios'
import { createSessionAction } from '@/app/actions/sessions'
import { medicalAgentPath } from '@/routes/api/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export type DoctorAgentType = {
  id: number,
  specialist: string,
  description: string,
  image: string,
  agentPrompt: string
}
type props = {
  doctorAgent: DoctorAgentType
}

function DoctorAgentCard({ doctorAgent }: props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleStartConversation = async () => {
    setLoading(true)
    try {
      const result = await createSessionAction({
        notes: "",
        selectedDoctor: doctorAgent
      })

      if ((result as any)?.sessionId) {
        window.location.assign(medicalAgentPath((result as any).sessionId))
      } else {
        console.error('Failed to create session')
        alert('Failed to start conversation. Please try again.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error starting conversation:', error)
      alert('Failed to start conversation. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className=''>
      <Image src={doctorAgent.image} alt={doctorAgent.specialist} width={200} height={300} className='w-full h-[250px] object-cover rounded-xl' />
      <h2 className='font-bold mt-1'>{doctorAgent.specialist}</h2>
      <p className='line-clamp-2 text-sm text-gray-500'>{doctorAgent.description}</p>
      <Button 
        className='w-full mt-2' 
        onClick={handleStartConversation}
        disabled={loading}
      >
        {loading ? <><Loader2 className="animate-spin" /> Starting...</> : <>Start Conversation <IconArrowRight /></>}
      </Button>
    </div>
  )
}

export default DoctorAgentCard