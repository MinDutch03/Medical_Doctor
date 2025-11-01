'use client'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import AddNewSessionDialog from './AddNewSessionDialog'
import { Button } from '@/app/components/ui/button'
import { deleteSessionAction, listSessionsAction } from '@/app/actions/sessions'
import { medicalAgentPath } from '@/routes/api/client'
import axios from 'axios'

type Session = {
  id: number;
  sessionId: string;
  notes: string;
  selectedDoctor: any;
  createdOn: string;
  conversation: any[];
}

function HistoryList() {
  const [historyList, setHistoryList] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const router = useRouter()

  const fetchSessions = useCallback(async () => {
    setLoading(true)
    try {
      const result = await listSessionsAction()
      console.log('Fetched sessions:', result)
      setHistoryList(result as any)
    } catch (error) {
      console.error('Error fetching sessions:', error)
      setHistoryList([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the card click
    
    if (!confirm('Are you sure you want to delete this consultation? This action cannot be undone.')) {
      return
    }

    try {
    await deleteSessionAction(sessionId)
      // Refresh the list after deletion
      fetchSessions()
    } catch (error) {
      console.error('Error deleting session:', error)
      alert('Failed to delete session. Please try again.')
    }
  }

  return (
    <div className='mt-10'>
      {loading ? (
        <div className='text-center py-10'>Loading...</div>
      ) : historyList.length === 0 ? (
        <div className='flex items-center flex-col justify-center gap-3 p-7 border-dashed rounded-2xl'>
          <Image src={'/medical-assistance.png'} alt='empty' height={150} width={150} />
          <h2 className='font-bold text-xl'>No Recent Consultations</h2>
          <p>It looks like you haven't consulted with any doctors yet.</p>
          <AddNewSessionDialog />
        </div>
      ) : (
        <div className='space-y-4'>
          <h3 className='font-semibold text-lg mb-4'>Recent Consultations</h3>
          {(showAll ? historyList : historyList.slice(0, 5)).map((session) => (
            <div 
              key={session.id} 
              onClick={() => window.location.assign(medicalAgentPath(session.sessionId))}
              className='border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3 flex-1'>
                  <Image 
                    src={session.selectedDoctor?.image || '/doctor1.png'} 
                    alt={session.selectedDoctor?.specialist || 'Doctor'} 
                    width={50} 
                    height={50} 
                    className='rounded-full object-cover'
                  />
                  <div className='flex-1'>
                    <h4 className='font-semibold'>{session.selectedDoctor?.specialist || 'General Physician'}</h4>
                    <p className='text-sm text-gray-500'>
                      {session.notes ? session.notes.substring(0, 60) + '...' : 'No notes'}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='text-right'>
                    <p className='text-sm text-gray-500'>{formatDate(session.createdOn)}</p>
                    <p className='text-xs text-gray-400'>
                      {session.conversation?.length || 0} messages
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(session.sessionId, e)}
                    className='text-red-600 hover:text-red-700 hover:bg-red-50'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {historyList.length > 5 && (
            <div className='flex justify-center pt-2'>
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className='text-blue-600 border-blue-600 hover:bg-blue-50'
              >
                {showAll ? 'Show Less' : `Show More (${historyList.length - 5} more)`}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default HistoryList