import AdminLayout from '@/components/Admin/AdminLayout'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'

export default function ImportantPanic() {
    const session = useSession()
    const [showDialog, setShowDialog] = React.useState(false)
    const handleStart = () =>{
        fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/adminPrivilages/importantPanic`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                userId:session?.data?.user?.session?.userId,
                randomStr:session?.data?.user?.session?.randomStr
            },
            body:JSON.stringify({
                panic:true
            })
        }).then(res=>{
            if(res.status === 401) return signOut()
            return res.json()
        }).then(res=>{
            setShowDialog(true)
        })
    }
    const handleEnd = () =>{
        fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/adminPrivilages/importantPanic`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                userId:session?.data?.user?.session?.userId,
                randomStr:session?.data?.user?.session?.randomStr
            },
            body:JSON.stringify({
                panic:false
            })
        }).then(res=>{
            if(res.status === 401) return signOut()
            return res.json()
        }).then(res=>{
            setShowDialog(true)
        })

    }
  return (
    <AdminLayout>
        {
            session?.data?.user?.session?.superAdmin ?
            <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Important Panic
            </h2>
            <button 
                onClick={handleStart}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
                Satışı durdur
            </button>
            <button 
                onClick={handleEnd}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 ml-2 rounded"
            >
                Satışı başlat
            </button>
            {showDialog && (
                <dialog 
                    className="rounded-lg p-5 border w-1/2 mx-auto mt-5 shadow-lg"
                    open={showDialog}
                >
                            <button 
                                onClick={() => setShowDialog(false)}
                                className="float-right text-gray-600 hover:text-gray-800"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                    <h1 className="text-lg font-semibold text-gray-900">
                        İşlem Başarılı
                    </h1>
                </dialog>
            )}
        </>
        
            :
        <h1>Yetkiniz yok</h1>
        }


    </AdminLayout>
  )
}
