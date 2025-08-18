import AdminLayout from '@/components/Admin/AdminLayout';
import validateThePhoneNumber from '@/lib/validateThePhoneNumber';
import { headers } from '@/next.config';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import z from "zod"
export default function ChangeToSirket() {
  const [foundUser, setFoundUser] = useState(false);
  const [email, setEmail] = useState("");
  const session = useSession();
  const router = useRouter();
  const [errorFields, setErrorFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [changePasswordValue, setChangePasswordValue] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  useEffect(() => {
    if(!session) return
    if(session.status === "loading") return
    console.log(session);
    if(!session || session.status !== "authenticated") {
    signOut()
    router.push("/api/auth/signin")
  }}, [session.status,session,router])
  
  const [foundUserInfo, setFoundUserInfo] = useState({});
  const handleSearch = async () => {
    try{
      fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/adminPrivilages/changeUser?email=${email}`, {
        method: "GET",
        headers:{
          'Content-Type':'application/json',
          userId:session.data.user.session.userId,
          randomStr:session.data.user.session.randomStr
      },
      })
      .then(res => {
        if(res.status === 401) return signOut()
        if(res.status === 404) {
          alert('Kullanıcı bulunamadı')
          return
        }
        return res.json()
      })
      .then(res=>{
        if(!res) return
        setFoundUser(true)
        setFoundUserInfo(res.user)
      })
    }
    catch(err){
      console.log(err);
    }
  }
  const handleSave = async () => {
    setErrorFields([])
    setLoading(true)
    if(!foundUserInfo){
      alert('Lütfen önce bir kullanıcı arayınız.')
      setLoading(false)
      return
    }
    if(!foundUserInfo?.phoneNumber){
      alert('Lütfen önce bir kullanıcı arayınız.')
      setLoading(false)
      return
    }
    console.log(foundUserInfo.phoneNumber);
    const validatedPhoneNumber = validateThePhoneNumber(foundUserInfo.phoneNumber)
    console.log(validatedPhoneNumber);
    if(!validatedPhoneNumber){
      alert('Lütfen geçerli bir telefon numarası giriniz.')
      setLoading(false)
      return
    }
    const formData = {
      name:foundUserInfo.name,
      surname:foundUserInfo.surname,
      email:foundUserInfo.email,
      phoneNumber: validatedPhoneNumber,
      password:changePassword ? changePasswordValue : "",
      isSaleAccount:foundUserInfo.isSaleAccount,
      isCompany:foundUserInfo.isCompany,
      iban:foundUserInfo.iban,
    }

    // TODO: replace alert with toast

    const schema = z.object({
      name: z.string().min(2).max(50),
      surname: z.string().min(2).max(50),
      email: z.string().email(),
      phoneNumber: z.number().refine((num) => {
        const numString = num.toString();
        return numString.length === 10 && /^[0-9]+$/.test(numString);
    }, {
        message: "Phone number must be a 10-digit integer."
    }) ,
    password: z.string().optional().refine((pass) => pass === "" || (pass.length >= 8 && pass.length <= 20), {
      message: "Password must be between 8 and 20 characters if not empty."
  }),
        isCompany: z.boolean(),
        isSaleAccount: z.boolean(),
        iban: z.string().refine((iban) => {
          return /^TR[0-9]{2}[A-Z0-9]{1,30}$/.test(iban) && iban.length === 26;
        }, {
          message: "Invalid IBAN format. Must start with 'TR' and be 26 characters long."
        })
  })

    try {
      console.log(formData);
      schema.parse(formData)
    }
    catch (error) {
      setErrorFields(error.issues.map(issue => issue.path))
      console.log(error);
      alert(error)
      setLoading(false)
      return
    }

    try {
      // Talk about this part
      fetch(
        `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/adminPrivilages/changeUser?id=${foundUserInfo.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(formData),
          headers:{
            'Content-Type':'application/json',
            userId:session.data.user.session.userId,
            randomStr:session.data.user.session.randomStr
          },
        },
      ).then(res => {
        if(res.status !== 200){
          alert('Beklenmedik bir hata oluştu. Lütfen tekrar deneyiniz.')
          return
        }
        return res.json()
      }).then(res => {
        if(!res) return
        console.log(res)
        if (res?.error) {
          alert(res.error)
          return
        }
        console.log('elo ')
        setConfirmDialogOpen(true)
        setLoading(false)
      })

    }
    catch (error) {
      alert(`Beklenmedik bir hata oluştu. Lütfen tekrar deneyiniz.`)
      console.log(error)
      setLoading(false)
    }

  }
  return (
    <AdminLayout>
      {
        foundUser ?
        <div className="max-w-md mx-auto">
        <div className="flex flex-col space-y-4">
            {/* Name Field */}
            <div>
                <label htmlFor="name" className="text-lg font-medium">İsim</label>
                <input type="text" name="name" id="name" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" value={foundUserInfo.name} onChange={
                  (e)=>setFoundUserInfo({...foundUserInfo,name:e.target.value})
                } />
            </div>
    
            {/* Surname Field */}
            <div>
                <label htmlFor="surname" className="text-lg font-medium">Soyisim</label>
                <input type="text" name="surname" id="surname" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" value={foundUserInfo.surname} 
                onChange={
                  (e)=>setFoundUserInfo({...foundUserInfo,surname:e.target.value})
                }
                />
            </div>
    
            {/* Email Field */}
            <div>
                <label htmlFor="email" className="text-lg font-medium">Email</label>
                <input type="text" name="email" id="email" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" value={foundUserInfo.email} 
                onChange={
                  (e)=>setFoundUserInfo({...foundUserInfo,email:e.target.value})
                }
                />
            </div>
    
            {/* Phone Number Field */}
            <div>
                <label htmlFor="phoneNumber" className="text-lg font-medium">Telefon Numarası</label>
                <input type="text" name="phoneNumber" id="phoneNumber" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" value={foundUserInfo.phoneNumber}
                onChange={
                  (e)=>setFoundUserInfo({...foundUserInfo,phoneNumber:(e.target.value).toString()})
                }
                />
            </div>
    
            {/* Sale Account Checkbox */}
            <div>
                <label htmlFor='isSaleAccount' className="text-lg font-medium">Üye </label>
                <input type='checkbox' disabled name='isSaleAccount' id='isSaleAccount' className="ml-2 align-middle" checked={foundUserInfo.isSaleAccount} />
            </div>
    
            {/* Password Field */}
            <label htmlFor="changePassword" className="text-lg font-medium">Şifre Değiştir</label>
            <input type='checkbox' name='changePassword' id='changePassword' className="ml-2 align-middle" checked={changePassword} onChange={(e)=>setChangePassword(e.target.checked)} />
            {changePassword &&
            <div>
                <label htmlFor="password" className="text-lg font-medium">Şifre</label>
                <input type="text" name="password" disabled={!foundUserInfo?.isSaleAccount} id="password" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" value={changePasswordValue}
                onChange={
                  (e)=>setChangePasswordValue(e.target.value)
                }
                />
            </div>
}
    
            {/* Company Checkbox */}
            <div>
                <label htmlFor="isCompany" className="text-lg font-medium">Şirket</label>
                <input type='checkbox' disabled={!foundUserInfo?.isSaleAccount} name='isCompany' id='isCompany' className="ml-2 align-middle" checked={foundUserInfo.isCompany}
                onChange={
                  (e)=>setFoundUserInfo({...foundUserInfo,isCompany:e.target.checked})
                }
                />
            </div>
    
            {/* IBAN Field */}
            <div>
                <label htmlFor='Iban' className="text-lg font-medium">IBAN</label>
                <input type='text' name='Iban' disabled={!foundUserInfo?.isSaleAccount} id='Iban' className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" value={foundUserInfo.iban}
                onChange={
                  (e)=>setFoundUserInfo({...foundUserInfo,iban:e.target.value})
                }
                />
            </div>
    
            {/* Buttons */}
            <div className="flex justify-between mt-4">
                <button onClick={() => { setFoundUser(false); setFoundUserInfo({}) }} className="py-2 px-4 bg-gray-200 text-black rounded hover:bg-gray-300">Geri Dön</button>
                <button onClick={handleSave} className="py-2 px-4 bg-primary text-white rounded hover:bg-primary-dark">Kaydet</button>
            </div>
        </div>
        <dialog open={confirmDialogOpen} className="fixed z-10 inset-0 overflow-y-auto">
          <h1>
            Kullanıcı Başarıyla Değiştirildi
          </h1>
          <button onClick={()=>{
            setConfirmDialogOpen(false)
            setFoundUser(false)
            setFoundUserInfo({})
          }}>
            Tamam
          </button>
        </dialog>
    </div>
    
         : 

         <div className="max-w-md mx-auto p-4 bg-white shadow rounded-lg">
         <h1 className="text-2xl font-semibold text-gray-800 mb-4">Müşterilerde Değişim Yap </h1>
         
         <div className="mb-4">
             <label className="block text-gray-700 text-sm font-bold mb-2">
                 Email
             </label>
             <input
                 type="text"
                 name="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
             />
         </div>
     
         <button 
             onClick={handleSearch}
             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
         >
             Ara
         </button>
     </div>
     
      }
    </AdminLayout>

  )
}
