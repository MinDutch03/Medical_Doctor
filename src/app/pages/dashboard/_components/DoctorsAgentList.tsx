import { AIDoctorAgents } from '@/constants/doctorAgents'
import React from 'react'
import DoctorAgentCard from './DoctorAgentCard'

function DoctorsAgentList() {
  return (
    <div className='mt-10'>
      <h2 className='font-bold text-xl'>AI Specialist Doctor Agents</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-5'>
        {AIDoctorAgents.map((doctor, index) => {
          return <div key={index}>
            <DoctorAgentCard doctorAgent={doctor}/>
          </div>
        })}
      </div>
    </div>
  )
}

export default DoctorsAgentList