import React, { useEffect, useMemo, useState } from 'react'
import AdminLayout from '@/components/Admin/AdminLayout'
import ImageFileInput from '@/components/Admin/ImageFileInput'
import { signOut, useSession } from 'next-auth/react'

export default function Images() {
  const [isOpen, setOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const session = useSession()

  useEffect(() => {
    setOpen(true)

    setTimeout(() => {
      setOpen(false)
    }, 3000)
  }, [msg])

  const inputs = useMemo(() => [
    {
      id: 'slider1',
      label: 'Slider 1',
      link: '',
      resolution: undefined,
    },
    {
      id: 'slider2',
      label: 'Slider 2',
      link: '',
      resolution: undefined,
    },
    {
      id: 'slider3',
      label: 'Slider 3',
      link: '',
      resolution: undefined,
    },
    {
      id: 'slider4',
      label: 'Slider 4',
      link: '',
      resolution: undefined,
    },
    {
      id: 'promotion1',
      label: 'Promotion 1',
      link: '',
      resolution: [450, 300],
    },
    {
      id: 'promotion2',
      label: 'Promotion 2',
      link: '',
      resolution: [450, 300],
    },
    {
      id: 'promotion3',
      label: 'Promotion 3',
      link: '',
      resolution: [450, 300],
    },
    {
      id: 'bigPromotion1',
      label: 'Big Promotion 1',
      link: '',
      resolution: [800, 640],
    },
    {
      id: 'bigPromotion2',
      label: 'Big Promotion 2',
      link: '',
      resolution: [450, 300],
    },
    {
      id: 'bigPromotion3',
      label: 'Big Promotion 3',
      link: '',
      resolution: [450, 300],
    },
    {
      id: 'bigPromotion4',
      label: 'Big Promotion 4',
      link: '',
      resolution: [450, 300],
    },
    {
      id: 'bigPromotion5',
      label: 'Big Promotion 5',
      link: '',
      resolution: [450, 300],
    },
  ], []);

  async function changeLink(type, link) {
    console.log(type, link, 'changeLink')
    await fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/admin/images`, {
      method: 'POST',
      headers: {
        "userId": session.data.user.dataValues.id,
        "randomStr": session.data.user.sessionToken
      },
      body: JSON.stringify({
        type,
        link,
      }),
    })
    .then(res => {if(res.status === 401) {return signOut  () }else return res.json()})
    async function reloadLinks() {
      const imagesWithLinksData = await fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/admin/images`, {
        headers: {
          "userId": session.data.user.dataValues.id,
          "randomStr": session.data.user.sessionToken
        },
      }).then(res => {if(res.status === 401) {return signOut  () }else return res.json()})
      const imagesWithLinks = imagesWithLinksData.images
  
      imagesWithLinks.forEach((imageWithLink) => {
        const input = inputs.find((input) => input.id === imageWithLink.type)
        input.link = imageWithLink.link
      })
    }
    reloadLinks()
  }

  

  useEffect(() => {
    if (!session.data)
      return
      async function reloadLinks() {
        const imagesWithLinksData = await fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/admin/images`, {
          headers: {
            "userId": session.data.user.dataValues.id,
            "randomStr": session.data.user.sessionToken
          },
        }).then(res => {if(res.status === 401) {return signOut  () }else return res.json()})
        const imagesWithLinks = imagesWithLinksData.images
    
        imagesWithLinks.forEach((imageWithLink) => {
          const input = inputs.find((input) => input.id === imageWithLink.type)
          input.link = imageWithLink.link
        })
      }
    reloadLinks()
  }, [session,inputs])

  return (
    <AdminLayout>
      {
        session?.data?.user?.session?.superAdmin ? 
        <>
      {msg && (
        <div className={`flex top-5 left-0 right-0 gap-5 px-3 py-2 text-white mx-auto bg-red-600 absolute w-fit origin-top transition-all duration-300 rounded-full ${isOpen ? 'scale-100' : 'scale-0'}`}>
          {msg}
        </div>
      )}
      <div className="w-full flex flex-wrap gap-5">
        {inputs.map((input, index) => (
          <div key={index}>
            <ImageFileInput uploadTo="photos" id={input.id} label={input.label} resolution={input.resolution} key={index} setMsg={setMsg} session={session} />
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Link" defaultValue={input.link.toS} onChange={(e) => input.link = e.target.value} />
            <button onClick={() => changeLink(input.id, input.link)} className="w-full px-3 py-2 border border-gray-300 bg-indigo-500 rounded-md">Linki Değiştir</button>
          </div>
        ))}
      </div>
        </>
        :
        <h1 className='w-full h-24 text-3xl justify-center flex '>Yetkiniz Yok</h1>
      }


    </AdminLayout>
  )
}
