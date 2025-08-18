import AdminLayout from '@/components/Admin/AdminLayout'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'

export default function DeleteUser() {
    const [email, setEmail] = useState('')
    const [isOpen, setOpen] = useState(false)
    const [safety, setSafety] = useState('')
    const session = useSession()
    console.log(session);
    const handleSubmit = (e) => {
        e.preventDefault()
        if(!session.data) return
        if(!session.data.user.session.superAdmin) return
        console.log(session.data.user.session);
        const userId = session.data.user.session.userId
        console.log(userId);
        const randomStr = session.data.user.session.randomStr
        console.log(randomStr);

        fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/adminPrivilages/deleteUser`, {
            method:'DELETE',
            query:{
                email
            },
            headers:{
                'Content-Type':'application/json',
                userId:userId,
                randomStr:randomStr
            }
        }).then(res=>{
            if(res.status === 401) return signOut()
            return res.json()
        })
        console.log(email)
    }
  return (
    <AdminLayout>
        {
            session?.data?.user?.session?.superAdmin ?
        <>
        <h1 className='w-full h-24 text-3xl justify-center flex '>Adam Sil</h1>
        <div className='flex flex-col'>
            <label htmlFor="email" className='w-full flex justify-center text-lg'>Email</label>
            <input type="email" name="email" id="email" onChange={(e)=>setEmail(e.target.value)} />
            <label htmlFor="safety" className='w-full flex justify-center text-lg'>Güvenlik Kodu</label>
            <input type="text" name="safety" id="safety" onChange={(e)=>setSafety(e.target.value)}/>
            <button type="submit" className='border border-black rounded-lg bg-primary w-24 h-12 mt-4 m-auto' onClick={()=>{
                if(safety !== process.env.NEXT_PUBLIC_DELETE_USER_SECRET) return
                setOpen(true)
            }}>Sil</button>

        </div>
        <dialog open={isOpen} className='absolute top-1/3 w-[600px] h-[200px]'>
            <button className='border border-black rounded-full right-0 absolute' onClick={()=>setOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 float-right" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={()=>setOpen(false)}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <p className='w-full justify-center flex mt-4 text-xl '>Üye {email} yi silmek istediginize emin misiniz?</p>
            <div className='flex w-full gap-4 mt-8 justify-center'>
                <button onClick={handleSubmit} className='w-24 h-12 border bg-green-500 rounded-lg border-black'>Evet</button>
                <button onClick={()=>setOpen(false)} className='w-24 h-12 border bg-red-500 rounded-lg border-black'>Hayır</button>
            </div>
        </dialog>
        </>:
        <h1 className='w-full h-24 text-3xl justify-center flex '>Yetkiniz Yok</h1>
        
        }


    </AdminLayout>
  )
}
