'use client'
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import { medicalAgentPath } from '@/routes/api/client'
import { useRouter } from "next/navigation";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import DoctorAgentCard, { DoctorAgentType } from "./DoctorAgentCard";
interface Props {
  // propName: string
}

const AddNewSessionDialog: React.FC<Props> = (props) => {
  const [note, setNote] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [suggestedDoctors, setSuggestedDoctors] = useState<DoctorAgentType[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAgentType>()

  const router = useRouter()

  const OnClickNext = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/suggest-doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: note })
      })

      if (!response.ok) throw new Error('Failed to suggest doctors')

      const data = await response.json()
      let doctorsArray: any[] = []
      if (Array.isArray(data)) doctorsArray = data
      else if (data?.doctors && Array.isArray(data.doctors)) doctorsArray = data.doctors
      else if (data?.suggestedDoctors && Array.isArray(data.suggestedDoctors)) doctorsArray = data.suggestedDoctors
      else if (typeof data === 'object') doctorsArray = Object.values(data).filter((item: any) => typeof item === 'object' && item !== null)
      setSuggestedDoctors(doctorsArray)
    } catch (error) {
      console.error('Error fetching suggested doctors:', error);
      setSuggestedDoctors([]);
    } finally {
      setLoading(false);
    }
  }

  const onStartConsultation = async () => {
    if (!selectedDoctor) {
      console.error('No doctor selected');
      return;
    }
    
    setLoading(true)

    console.log('Starting consultation with doctor:', selectedDoctor);

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: note,
          selectedDoctor: selectedDoctor
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create session')
      }

      const result = await response.json()

      console.log('Session created:', result)
      if (result?.sessionId) {
        setLoading(false)
        window.location.assign(medicalAgentPath(result.sessionId))
      } else {
        setLoading(false)
        alert('Failed to start conversation. Please try again.')
      }
    } catch (error) {
      console.error('Error starting consultation:', error)
      setLoading(false)
      alert('Failed to start conversation. Please try again.')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+ Start a consultation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>

            {suggestedDoctors?.length === 0 ?
              <div>
                <h2>Add Symptoms or any other details</h2>
                <Textarea placeholder="Add Detail here" className="h-[200px] mt-1"
                  value={note}
                  onChange={(e) => { setNote(e.target.value) }} />
              </div>
              : <div className="grid grid-cols-2 gap-5">
                {/* //Suggested Doctors */}
                {suggestedDoctors.length > 0 ? (
                  suggestedDoctors.map((doctor, index) => {
                    return <SuggestedDoctorCard key={index} doctorAgent={doctor} setSelectedDoctor={setSelectedDoctor} selectedDoctor={selectedDoctor} />
                  })
                ) : (
                  <p className="text-center text-gray-500 col-span-2">No doctors found. Please try different symptoms.</p>
                )}
              </div>}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>
              Cancel
            </Button>
          </DialogClose>
          {suggestedDoctors.length === 0 ?
            <Button disabled={loading} onClick={() => OnClickNext()}>{loading && <Loader2 className="animate-spin" />} Next <ArrowRight /></Button>
            :
            <Button onClick={() => onStartConsultation()} disabled={!selectedDoctor || loading}>{loading && <Loader2 className="animate-spin" />} Start Conversation</Button>
          }
        </DialogFooter>
      </DialogContent>


    </Dialog >
  );
};

export default AddNewSessionDialog;