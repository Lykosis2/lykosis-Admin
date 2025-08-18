import AdminLayout from '@/components/Admin/AdminLayout'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

export default function Calender() {
    const [name,setName] = useState("")
    const [date,setDate] = useState("")
    const [type,setType] = useState("online")
    const [link,setLink] = useState("")
    const session = useSession()
    const handleSubmit = async(e)=>{
        e.preventDefault()
        console.log(name);
        console.log(date);
        console.log(type);
        console.log(link);
        const returned = await fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/bulusmaTakvim`,{
            method:"POST",
            headers:{
                userId:session.data.user.dataValues.id,
                randomStr:session.data.user.sessionToken,
            },
            body:JSON.stringify({
                title:name,
                type:type,
                link:link,
                time:date
            })
        }).then(res=>{
            if(res.status === 401) return signOut()
            return res.json()
        })

        console.log(returned);

    }
    useEffect(() => {
        console.log(type);
    }
    , [type])
  return (
    <AdminLayout>
        <div className='w-full h-[95%] flex bg-white flex-col'>
            <h2 className='text-3xl font-bold w-full flex justify-center mt-6 '> 
                Buluşma Ekle 
            </h2>
            <form onSubmit={handleSubmit}>
                <label className='text-xl font-semibold mt-6'>Buluşma Adı</label>
                <input className='w-full h-10 border border-gray-300 rounded-lg px-3 mt-2' type="text" onChange={(e)=>setName(e.target.value)} />
                <label className='text-xl font-semibold mt-6'>Buluşma Tarihi</label>
                <input className='w-full h-10 border border-gray-300 rounded-lg px-3 mt-2' type="date" onChange={(e)=>{
                    console.log(e.target.value);
                    setDate(e.target.value)}} />
                <label className='text-xl font-semibold mt-6'>Buluşma Saati</label>
                <input className='w-full h-10 border border-gray-300 rounded-lg px-3 mt-2' type="time" onChange={(e) => {
    const newTime = e.target.value;
    // Assuming you already have a date stored in the state variable `date`
    setDate((existingDate) => {
      const updatedDate = existingDate ? existingDate.split('T')[0] : new Date().toISOString().split('T')[0];
      // Combine the date and time
      const combinedDateTime = `${updatedDate}T${newTime}`;
      console.log(combinedDateTime);
      return combinedDateTime;
    });
  }} />
            
                <label className='text-xl font-semibold mt-6'>Buluşma Tipi</label>
                <select className='w-full h-10 border border-gray-300 rounded-lg px-3 mt-2' onChange={(e)=>{
                    setType(e.target.value)
                }} >
                    <option value="online">Online</option>
                    <option value="ofis">Ofis</option>
                    <option value="otel">Otel</option>
                </select>
                <label className='text-xl font-semibold mt-6'>Buluşma Linki</label>
                <input className='w-full h-10 border border-gray-300 rounded-lg px-3 mt-2' type="text" onChange={(e)=>setLink(e.target.value)} />
                <button className=' w-36 h-12 bg-primary border border-black flex mt-4 m-auto justify-center items-center rounded-lg ' type='submit'>
                    <span className='text-lg '>

                    Ekle 
                    </span>
                </button>
            </form>

        </div>
    </AdminLayout>

  )
}
