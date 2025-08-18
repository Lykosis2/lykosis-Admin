import AdminLayout from '@/components/Admin/AdminLayout'
import GeneratedQrCode from '@/components/Admin/GeneratedQrCode'
import { signOut, useSession } from 'next-auth/react'
import QRCode from 'qrcode.react'
import React, { useState } from 'react'

export default function CreateAdmin() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [surname, setSurname] = useState('')
    const [superAdmin, setSuperAdmin] = useState(false)
    const [safety, setSafety] = useState('')
    const [done, setDone] = useState(false)
    const [createdSecret , setCreatedSecret] = useState('')
    const [isOpen, setOpen] = useState(false)
    const session = useSession()
    console.log(session );

    const handleSubmit = (e) => {
        e.preventDefault()
        if(safety !== process.env.NEXT_PUBLIC_CREATE_ADMIN_SECRET) return
        if(!session.data) return
        if(!session.data.user.session.superAdmin) return
        console.log(process.env.NEXT_PUBLIC_PRODUCTION_URL);
        fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/adminPrivilages/createAdmin`, {
            method:'POST',
            body:JSON.stringify({
                name,
                surname,
                email,
                password,
                phoneNumber,
                superAdmin
            }),
            headers:{
                'Content-Type':'application/json',
                userId:session.data.user.session.userId,
                randomStr:session.data.user.session.randomStr
            }
        })
        .then(res=>{
            if(res.status === 401) return signOut()
            return res.json()
        })
        .then(res=>{console.log(res)

            if(!res) return
            setDone(true);setCreatedSecret(res.twoFaSecret)}).catch(err=>{console.log(err);setDone(false);setCreatedSecret('')})
    }

  return (
    <AdminLayout>
        {
            session?.data?.user?.session?.superAdmin ?
        <>
        <h1 className='w-full h-24 text-3xl justify-center flex '>
            Admin Ekle 
        </h1>
        <div className='flex flex-col space-y-4 p-4 max-w-md mx-auto'>
    <div className='flex flex-col'>
        <label htmlFor="name" className='text-lg font-medium'>Name</label>
        <input type="text" name="name" id="name" className='mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary' onChange={(e)=>setName(e.target.value)} />
    </div>

    <div className='flex flex-col'>
        <label htmlFor="surname" className='text-lg font-medium'>Surname</label>
        <input type="text" name="surname" id="surname" className='mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary' onChange={(e)=>setSurname(e.target.value)} />
    </div>

    <div className='flex flex-col'>
        <label htmlFor="email" className='text-lg font-medium'>Email</label>
        <input type="email" name="email" id="email" className='mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary' onChange={(e)=>setEmail(e.target.value)} />
    </div>

    <div className='flex flex-col'>
        <label htmlFor="phoneNumber" className='text-lg font-medium'>Phone Number</label>
        <input type="text" name="phoneNumber" id="phoneNumber" className='mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary' onChange={(e)=>setPhoneNumber(e.target.value)} />
    </div>

    <div className='flex flex-col'>
        <label htmlFor="password" className='text-lg font-medium'>Password</label>
        <input type="password" name="password" id="password" className='mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary' onChange={(e)=>setPassword(e.target.value)} />
    </div>

    <div className='flex items-center'>
        <input type="checkbox" name="superAdmin" id="superAdmin" className='mr-2' onChange={(e)=>setSuperAdmin(e.target.checked)} />
        <label htmlFor="superAdmin" className='text-lg font-medium'>Super Admin</label>
    </div>

    <div className='flex flex-col'>
        <label htmlFor="safety" className='text-lg font-medium'>Güvenlik Kodu</label>
        <input type="text" name="safety" id="safety" className='mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary' onChange={(e)=>setSafety(e.target.value)}/>
    </div>

    <button type="submit" className='border border-black rounded-lg bg-primary hover:bg-primary-dark text-white w-24 h-12 mt-4 mx-auto transition duration-300 ease-in-out' onClick={()=>{
        console.log(safety , process.env.NEXT_PUBLIC_CREATE_ADMIN_SECRET);
        if(safety !== process.env.NEXT_PUBLIC_CREATE_ADMIN_SECRET) return
        setOpen(true)
    }}>Oluştur</button>
</div>

        <dialog open={isOpen} className='absolute top-1/3 w-[600px] h-[200px]'>
            
            <button className='border border-black rounded-full right-0 absolute' onClick={()=>setOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 float-right" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={()=>setOpen(false)}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            {done? 
           <div className='flex justify-evenly items-center w-full h-full'>
<span>
    <p className='w-full justify-center flex mt-4 text-xl '>Admin Oluşturuldu</p>
</span>
{
                createdSecret ? 
                <>
                <QRCode value={createdSecret} />
                <span>
                    <p className='w-full justify-center flex mt-4 text-xl '>Kod: {createdSecret}</p>
                </span>
                </>
                :
                <span>
                    <p className='w-full justify-center flex mt-4 text-xl '>Kod: {createdSecret}</p>
                </span>

            }
            
           </div>
                         

           :
            <>
             <p className='w-full justify-center flex mt-4 text-xl '>{email} i admin yapmak istediginize emin misiniz ? </p>
            <div className='flex w-full gap-4 mt-8 justify-center'>
                <button onClick={handleSubmit} className='w-24 h-12 border bg-green-500 rounded-lg border-black'>Evet</button>
                <button onClick={()=>setOpen(false)} className='w-24 h-12 border bg-red-500 rounded-lg border-black'>Hayır</button>
            </div>
            </>
            }
        </dialog>
        </>
        :
        <h1 className='w-full h-24 text-3xl justify-center flex '>Yetkiniz Yok</h1>
        }
        
    </AdminLayout>
  )
}
