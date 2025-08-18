import AdminLayout from '@/components/Admin/AdminLayout'
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const session = useSession()
  console.log(session);
 
  const [dashboardData, setDashboardData] = useState({
    "Aylık kazanç":"0",
    "Aylık Puan":"0",
    "Kullanıcı Sayısı":"0",
    "Üye Sayısı":"0",
    "Aktif Üye Sayısı":"0",
    "Sipariş Sayısı":"0",
    "Iade Sayısı":"0",
    "Hissedar Bonusu":"0",
})
  useEffect(() => {
    if(session.status !== "authenticated") return
     fetch (`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/admin/dashboard`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          "userId":session.data.user?.dataValues.id,
          "randomStr":session.data.user?.sessionToken
        }
     }).then(dashboard =>{
      if(dashboard.status === 401) return signOut()
      return dashboard.json()
    }
      ).then(dashboard =>{
        console.log(dashboard);
      setDashboardData(dashboard) 
      }
      )

      
  }, [session])

  console.log(dashboardData);
  
  return (
        <AdminLayout>
          {
            session?.data?.user?.session?.superAdmin ?
            <div className="w-full h-full grid grid-cols-auto-fit-400px">
              {
                Object.keys(dashboardData).map((item,index)=>(
                  <div key={index} className="w-96 h-96 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center">
                    <h1 className="text-2xl font-semibold">{item.replace(/([A-Z])/g, ' $1')}</h1>


                    <p className="text-gray-500">{dashboardData[item]}</p>
                  </div>
                )
                )
              }
               
            </div>
            :
            <h1 className='w-full h-screen bg-white flex justify-center text-3xl items-center'>
              Yetkiniz Bulunmamaktadır
            </h1>
          }
        </AdminLayout>
  )
}
