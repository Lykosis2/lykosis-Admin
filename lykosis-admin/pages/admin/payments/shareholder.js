import AdminLayout from '@/components/Admin/AdminLayout'
import { useSession,signOut } from 'next-auth/react'

export default function Career() {
  const session = useSession()
  return (
    <AdminLayout>
      {
        session?.data?.user?.session?.superAdmin ?
      <div className="flex w-full h-full justify-center items-center">
         <button onClick={()=>{
          fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/adminPrivilages/download-bonus/hissedar`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                userId:session.data.user.session.userId,
                randomStr:session.data.user.session.randomStr
            }
        }).then(res=>{
            if(res.status === 401) return signOut()
            // DOWNLOAD CSV FILE 
            return res.blob()
        }).then(blob=>{
          blob.text().then(text=>{
            const a = document.createElement('a')
            a.href = window.URL.createObjectURL(new Blob([text], {type: 'text/csv'}))
            a.setAttribute('download', 'hissedar.csv')
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          })

        })

        }} className="bg-primary text-white px-4 py-2 rounded-md">CSV Dosyasını İndir</button>
      </div>
      :
      <h1 className='w-full h-screen bg-white flex justify-center text-3xl items-center'>
        Yetkiniz Bulunmamaktadır
      </h1>
      }
    </AdminLayout>
  )
}
