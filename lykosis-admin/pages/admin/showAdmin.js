import AdminLayout from '@/components/Admin/AdminLayout'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { FixedSizeList } from 'react-window'

export default function ShowAdmin() {
    const [allAdmins, setAllAdmins] = useState([])
    const [loading, setLoading] = useState(true)
    const session = useSession()
    console.log(session);
    useEffect(() => {
        if(!session.data) return
        if(!session.data.user.session.superAdmin) return
        fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/adminPrivilages/showAllAdmins`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                userId:session.data.user.session.userId,
                randomStr:session.data.user.session.randomStr
            }
        }).then(res=>{
            if(res.status === 401) return signOut()
            return res.json()
        }).then(res=>{
            setAllAdmins(res);
            setLoading(false)
        })
    }
    , [session.data])
    console.log(allAdmins);
  return (
    <AdminLayout>
        {
            session?.data?.user?.session?.superAdmin ?
                loading ? "Yükleniyor" : 
            <FixedSizeList
                height={800}
                width={1450}
                itemSize={120}
                itemCount={allAdmins.length}
                itemData={allAdmins}
            >
    {Row}
            </FixedSizeList>
            
            :
            <h1>Yetkiniz yok</h1>
        }
    </AdminLayout>
    )
}

const Row = ({ data,index, style }) => {
    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4 mb-4" style={{style,display:"flex",justifyContent:"start", gap:"25px"}}>
        <div className="mb-4">
            <span className="block text-gray-700 text-sm font-bold mb-2">
                Id: {data[index]?.id}
            </span>
        </div>
        <div className="mb-4">
            <span className="block text-gray-700 text-sm font-bold mb-2 ">
                İsim: {data[index]?.name}
            </span>
        </div>
        <div className="mb-4">
            <span className="block text-gray-700 text-sm font-bold mb-2">
                Soyisim: {data[index]?.surname}
            </span>
        </div>
        <div className="mb-4">
            <span className="block text-gray-700 text-sm font-bold mb-2">
                Email: {data[index]?.email}
            </span>
        </div>
        <div className="mb-4">
            <span className="block text-gray-700 text-sm font-bold mb-2">
                Telefon Numarası: {data[index]?.phoneNumber}
            </span>
        </div>
        <div className="mb-4">
            <span className="block text-gray-700 text-sm font-bold mb-2">
                Super Admin: {data[index]?.superAdmin ? "Evet" : "Hayır"}
            </span>
        </div>
    </div>
    
    )
}