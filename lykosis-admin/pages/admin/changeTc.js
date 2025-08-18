import AdminLayout from '@/components/Admin/AdminLayout'
import { useSession } from 'next-auth/react'
import React from 'react'

export default function ChangeTc() {
    const session = useSession()
  return (
    <AdminLayout>
      {
        session?.data?.user?.session?.superAdmin ?
        <>
        </>:
        <h1 className='w-full h-screen bg-white flex justify-center text-3xl items-center'>
          Yetkiniz Bulunmamaktadır
        </h1>
      }

    </AdminLayout>
  )
}
