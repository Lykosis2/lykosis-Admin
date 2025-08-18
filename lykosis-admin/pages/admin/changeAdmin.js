import AdminLayout from '@/components/Admin/AdminLayout'
import { signOut, useSession } from 'next-auth/react'
import React, { useState } from 'react'

export default function ChangeAdmin() {
    const [email, setEmail] = useState('')
    const [safety, setSafety] = useState('')
    const [isOpen, setOpen] = useState(false)
    const session = useSession()
    const [done, setDone] = useState(false)
    const [foundAdmin, setFoundAdmin] = useState({})
    const [success, setSuccess] = useState(false)
    console.log(session);

    const handleSearch = (e) => {
        e.preventDefault()
        if(safety !== process.env.NEXT_PUBLIC_CHANGE_ADMIN_SECRET) return
        if(!session.data) return
        if(!session.data.user.session.superAdmin) return
        fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/adminPrivilages/changeAdmin?email=${email}`, {
            method:'GET',
            headers:JSON.stringify({
                'Content-Type':'application/json',
                userId:session.data.user.session.userId,
                randomStr:session.data.user.session.randomStr
            })
        }).then(res=>{
            log
            if(res.status === 401) return signOut()
            return res.json()
        })
        .then(res=>{console.log(res)
        if(!res) return
        setDone(true)
        setFoundAdmin(res)
    }

        
        )
    }

    const handleSubmit = async (e) => {
        console.log(foundAdmin);
        fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/adminPrivilages/changeAdmin?id=${foundAdmin.id}`, {
            method:"PATCH",
            body:JSON.stringify(foundAdmin),
            headers:{
                'Content-Type':'application/json',
                userId:session.data.user.session.userId,
                randomStr:session.data.user.session.randomStr
            }
        }).then(res=>{
            if(res.status === 401) return signOut()
            return res.json()
        }).then(res=>{
            if(!res) return
            setSuccess(true)
            setFoundAdmin({})
            setDone(false)
        })

    }
    const handleDelete = async (e) => {
        console.log(foundAdmin);
        fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/adminPrivilages/changeAdmin?email=${foundAdmin.email}`, {
            method:"DELETE",
            headers:{
                'Content-Type':'application/json',
                userId:session.data.user.session.userId,
                randomStr:session.data.user.session.randomStr
            }
        }).then(res=>{
            if(res.status === 401) return signOut()
            return res.json()
        }).then(res=>{
            if(!res) return
            setSuccess(true)
            setFoundAdmin({})
            setDone(false)
        })
    }
  return (
    <AdminLayout>
{        session?.data?.user?.session?.superAdmin ? 
            success?
            <>
            <h1 className='w-full h-24 text-3xl flex justify-center items-center text-gray-800 font-bold'>Başarılı</h1>
            <button onClick={()=>setSuccess(false)} className='w-24 h-12 border border-black rounded-xl '>
                Geri
            </button>
            </>
            :

            done ? 
            !!foundAdmin ? 
            <>
    <h1 className='w-full h-24 text-3xl flex justify-center items-center text-gray-800 font-bold'>Admin Düzenle</h1>
    
    <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-xs">
            <label htmlFor="email" className='block text-lg text-gray-700'>Email</label>
            <input 
                type="email" 
                name="email" 
                id="email" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setFoundAdmin({ ...foundAdmin, email: e.target.value })}
                value={foundAdmin.email}
            />
        </div>

        <div className="w-full max-w-xs">
            <label htmlFor="name" className='block text-lg text-gray-700'>Name</label>
            <input 
                type="text" 
                name="name" 
                id="name" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setFoundAdmin({ ...foundAdmin, name: e.target.value })}
                value={foundAdmin.name}
            />
        </div>

        <div className="w-full max-w-xs">
            <label htmlFor="surname" className='block text-lg text-gray-700'>Surname</label>
            <input 
                type="text" 
                name="surname" 
                id="surname" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setFoundAdmin({ ...foundAdmin, surname: e.target.value })}
                value={foundAdmin.surname}
            />
        </div>

        <div className="w-full max-w-xs">
            <label htmlFor="phoneNumber" className='block text-lg text-gray-700'>Phone Number</label>
            <input 
                type="text" 
                name="phoneNumber" 
                id="phoneNumber" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setFoundAdmin({ ...foundAdmin, phoneNumber: e.target.value })}
                value={foundAdmin.phoneNumber}
            />
        </div>

        <div className="w-full max-w-xs flex items-center">
            <label htmlFor="superAdmin" className='block text-lg text-gray-700 mr-2'>Super Admin</label>
            <input 
                type="checkbox" 
                name="superAdmin" 
                id="superAdmin" 
                className="form-checkbox h-5 w-5 text-blue-600"
                onChange={(e) => setFoundAdmin({ ...foundAdmin, superAdmin: e.target.checked })}
                checked={foundAdmin.superAdmin}
            />
        </div>

        <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
        >
            Kaydet
        </button>
        <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300"
        >
            Sil
        </button>
    </div>
</>

            : 
            <>
                <h1 className='w-full h-24 text-3xl justify-center flex '>Admin Bulunamadı </h1>
                <button onClick={()=>{
                    setDone(false)
                    setFoundAdmin({})
                }} className='w-24 h-12 border border-black rounded-xl '> 
                    Geri
                </button>
            </>
           :
           <>
    <h1 className='w-full h-24 text-3xl flex justify-center items-center text-gray-800 font-bold'>Admin Düzenle</h1>

    <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-xs">
            <label htmlFor="email" className='block text-lg text-gray-700'>Email</label>
            <input 
                type="email" 
                name="email" 
                id="email" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setEmail(e.target.value)}
                
            />
        </div>

        <div className="w-full max-w-xs">
            <label htmlFor="safety" className='block text-lg text-gray-700'>Güvenlik Kodu</label>
            <input 
                type="text" 
                name="safety" 
                id="safety" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setSafety(e.target.value)}
            />
        </div>

        <button 
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
        >
            Ara
        </button>
    </div>
</>

       
            
         :<h1>
            YETKINIZ YETERLI DEGIL 
</h1>
}        
        
    </AdminLayout>
  )
}
