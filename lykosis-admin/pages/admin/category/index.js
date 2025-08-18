import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import AdminLayout from '@/components/Admin/AdminLayout'
import ImageFileInput from '@/components/Admin/ImageFileInput'
import {  useSession } from 'next-auth/react'

const headers = [
  {
    name: 'Kategori Adı',
    styles: 'min-w-[300px]',
  },
  {
    name: 'İkon',
    styles: 'min-w-[90px]',
  },
]

export default function Products() {
  const [tableData, setTableData] = useState([])
  const session = useSession()
  
  function refreshTableData() {
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/categories`)
      .then((res) => {
        if(res.status === 401) return signOut()
        return res.json()
      })
      .then((res) => {
        setTableData(
          res.categories.map(cat => ({
            id: cat.id,
            name: cat.label,
            styles: 'min-w-[300px]',
          })).filter(cat => cat.id !== null),
        )
      })
  }

  useEffect(() => {
    function refreshTableData() {
      fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/categories`)
        .then((res) => {
          if(res.status === 401) return signOut() 
          return res.json()
        })
        .then((res) => {
          setTableData(
            res.categories.map(cat => ({
              id: cat.id,
              name: cat.label,
              styles: 'min-w-[300px]',
            })).filter(cat => cat.id !== null),
          )
        })
    }
    refreshTableData()
  }, [session.data])
  
  return (
    <AdminLayout>
      {
        session.data?.user?.session?.superAdmin ? <div className="w-full h-full overflow-x-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-black">Kategoriler</h1>
          <NewItemButton refreshTableData={refreshTableData} session={session} />
        </div>
        <table className="w-full table-auto">
          <TableHead headers={headers} />
          <tbody>
      {tableData?.map((row, index) => (
        <tr className="border-b border-stroke" key={index}>
          <td className="py-[18px] pl-6 pr-3">
            <p className="text-sm text-body-color">{row.name}</p>
          </td>
          <td className="py-[18px] px-4">
            <p className="text-sm text-body-color">
              <Image src={`${process.env.NEXT_PUBLIC_CDN_URL}/categories/${row.id}`} width={24} height={24} alt={row.name} />
            </p>
          </td>
          <td className="py-[18px] pl-4 pr-6">
            <Dropdown id={row.id} name={row.name} refreshTableData={refreshTableData} session={session}/>
          </td>
        </tr>
      ))}
    </tbody>
        </table>
      </div> : <h1>
          Yetkiniz yok
        </h1>
      }
      
    </AdminLayout>
  )
}

function TableHead({ headers }) {
  return (
    <thead>
      <tr className="border-b border-stroke">
        {headers.map((header, index) => (
          <th
            className={`py-5 px-4 first:pl-8 last:pr-8 ${header.styles}`}
            key={index}
          >
            <p className="text-left text-base font-medium text-black">
              {header.name}
            </p>
          </th>
        ))}
      </tr>
    </thead>
  )
}



function NewItemButton({ refreshTableData,session }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [createdCategoryId, setCreatedCategoryId] = useState(null)
  const [triggerUpload, setTriggerUpload] = useState(false)

  const trigger = useRef(null)
  const dropdown = useRef(null)

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current)
        return
      if (
        !dropdownOpen
        || dropdown.current.contains(target)
        || trigger.current.contains(target)
      )
        return
      setDropdownOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  }, [])

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27)
        return
      setDropdownOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  }, [])

  const dialogRef = useRef(null)
  const [categoryName, setCategoryName] = useState('')

  function handleInputChange(e) {
    setCategoryName(e.target.value)
  }

  function handleDialogClose(button) {
    dialogRef.current.close()
  }

  async function handleCreation() {
    await fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/admin/category/route`, {
      method: 'POST',
      body: JSON.stringify({
        name: categoryName,
      }),
      headers:{
        userId: session?.data?.user?.dataValues?.id,
        randomStr : session?.data?.user?.sessionToken,
      }
    }).then((res) => {
      if(res.status === 401) return signOut()
      return res.json()
    }).then((res) => {
      setCreatedCategoryId(res.createdCategory.id)
      handleDialogClose()
      refreshTableData()
      setCategoryName('')
    })
  }

  return (
    <>
      <div className="relative">
        <button
          ref={trigger}
          onClick={() => {
            setDropdownOpen(!dropdownOpen)
            dialogRef.current.showModal()
          }}
          className="bg-primary text-white rounded-full px-5 py-2 text-sm font-medium"
        >
          Yeni Kategori Ekle
        </button>
      </div>
      <dialog ref={dialogRef}>
        <ImageFileInput uploadTo="category" id={createdCategoryId} label="İkon" resolution={[24, 24]} session={session} triggerUpload={triggerUpload} setTriggerUpload={setTriggerUpload} onlyOnTrigger={true} />
        <Input onChange={handleInputChange} label="Kategori Adı" defaultValue="" type="text"
          placeholder="Yeni isim giriniz" />
        <div className="flex justify-center gap-2 mt-5">
          <button onClick={() => handleDialogClose('İptal')}
            className="border border-primary text-primary hover:bg-primary hover:text-white rounded-full px-5 py-2 text-sm font-medium">İptal
          </button>
          <button onClick={async () => {
            await handleCreation()
            setTriggerUpload(true)
          }}
            className="bg-primary text-white rounded-full px-5 py-2 text-sm font-medium" >Kaydet
          </button>
        </div>
      </dialog>
    </>
  )
}

function Dropdown({ id, name, refreshTableData,session }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const trigger = useRef(null)
  const dropdown = useRef(null)

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current)
        return
      if (
        !dropdownOpen
        || dropdown.current.contains(target)
        || trigger.current.contains(target)
      )
        return
      setDropdownOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  }, [])

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27)
        return
      setDropdownOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  const dialogRef = useRef(null)
  const [categoryName, setCategoryName] = useState(name)

  function handleInputChange(e) {
    setCategoryName(e.target.value)
  }

  function handleDialogClose(button) {
    dialogRef.current.close()
  }

  async function handleUpdate() {
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/admin/category/route?id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: categoryName,
      }),
      headers:{
        userId: session?.data?.user?.dataValues?.id,
        randomStr : session?.data?.user?.sessionToken,
      }
    }).then((res) => {
      if(res.status === 401) return signOut()
      return res.json()
    }).then((res) => {
      console.log(res)
      handleDialogClose()
      refreshTableData()
      setCategoryName('')
      // TODO: refresh table
    })

    // TODO: PUT image
  }

  async function handleDeletion() {
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/admin/category/route?id=${id}`, {
      method: 'DELETE',
      headers:{
        userId: session?.data?.user?.dataValues?.id,
        randomStr : session?.data?.user?.sessionToken,
     }
      ,
    }).then((res) => {
      if(res.status === 401) return signOut()
      return res.json()
    }).then((res) => {
      console.log(res)
      setDropdownOpen(false)
      refreshTableData()
      // TODO: refresh table
    })
  }

  return (
    <>
      <div className="relative">
        <button
          ref={trigger}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-[#98A6AD]"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12Z"
              fill="#637381"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5C14 6.10457 13.1046 7 12 7C10.8954 7 10 6.10457 10 5Z"
              fill="#637381"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 19C10 17.8954 10.8954 17 12 17C13.1046 17 14 17.8954 14 19C14 20.1046 13.1046 21 12 21C10.8954 21 10 20.1046 10 19Z"
              fill="#637381"
            />
          </svg>
        </button>

        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
          className={`absolute right-0 top-full z-40 w-fit space-y-1 rounded bg-white p-2 mr-16 shadow-card border ${dropdownOpen === true ? 'block' : 'hidden'
            }`}
        >
          <button onClick={() => {
            setDropdownOpen(false)
            dialogRef.current.showModal()
          }}
            className="w-full rounded py-2 px-3 text-left text-sm hover:bg-gray-200">
            Düzenle
          </button>
          <button onClick={() => handleDeletion()}
            className="w-full rounded py-2 px-3 text-left text-sm text-custom-button-red hover:bg-gray-200">
            Kaldır
          </button>
        </div>
      </div>
      <dialog ref={dialogRef}>
        <ImageFileInput session={session} uploadTo="category" id={id} label="İkon" resolution={[24, 24]} />
        <Input onChange={handleInputChange} label="Kategori Adı" defaultValue={name} type="text"
          placeholder="Yeni isim giriniz" />
        <div className="flex justify-center gap-2 mt-5">
          <button onClick={() => handleDialogClose('İptal')}
            className="border border-primary text-primary hover:bg-primary hover:text-white rounded-full px-5 py-2 text-sm font-medium">İptal
          </button>
          <button onClick={() => handleUpdate()}
            className="bg-primary text-white rounded-full px-5 py-2 text-sm font-medium">Kaydet
          </button>
        </div>
      </dialog>
    </>
  )
}

function Input({ label, type = 'text', placeholder, defaultValue, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className='mb-3 block text-base font-medium text-black'>
        {label}
      </label>
      <input
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className='border-form-stroke text-body-color placeholder-body-color focus:border-primary active:border-primary w-full rounded-lg border-[1.5px] py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]'
      />
    </div>
  )
}
