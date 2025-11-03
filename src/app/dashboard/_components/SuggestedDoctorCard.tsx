import Image from "next/image";
import React from "react";

interface Props {
  // propName: string
  doctorAgent: any,
  setSelectedDoctor: any,
  selectedDoctor: any
}

const SuggestedDoctorCard: React.FC<Props> = (props) => {
  const imagePath = props.doctorAgent?.image || '/doctor1.png'; // Fallback to default image
  
  return (
    <div className={`flex flex-col items-center border rounded-2xl shadow p-5 hover:border-blue-500 cursor-pointer ${props.selectedDoctor?.id == props.doctorAgent.id && "border-blue-500"}`} onClick={()=>props.setSelectedDoctor(props.doctorAgent)}>
      <Image src={imagePath} alt={props.doctorAgent?.specialist || 'Doctor'} width={70} height={70} className='w-[50px] h-[50px] rounded-4xl object-cover' />
      <h2 className="font-bold text-sm text-center">{props.doctorAgent?.specialist}</h2>
      <p className="text-xs text-center line-clamp-2">{props.doctorAgent?.description}</p>
    </div>
  );
};

export default SuggestedDoctorCard;