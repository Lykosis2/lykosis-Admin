import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import XmarkIcon from '@/components/icons/XmarkIcon'
import AdminLayout from '@/components/Admin/AdminLayout'
import ImageFileInput from '@/components/Admin/ImageFileInput'
import { signOut, useSession } from 'next-auth/react'
import Select from "react-select";
const headers = [
  {
    name: 'Ürün Adı',
    styles: 'min-w-[300px]',
  },
  {
    name: 'Barcode',
    styles: 'min-w-[90px]',
  },
  {
    name: 'Fiyat',
    styles: 'min-w-[90px]',
  },
  {
    name: 'Stok',
    styles: 'min-w-[90px]',
  },
  {
    name: 'Puan',
    styles: 'min-w-[90px]',
  },
  {
    name: 'Özel',
    styles: 'min-w-[90px]',
  },
]

export default function Products() {
  const [tableData, setTableData] = useState()
  const session = useSession()
  
console.log(session?.data?.user);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/products`).then((res) => {
      if(res.status === 401) return signOut()
      return res.json()
    }).then((res) => {
      setTableData(res.products.map(p => ({
        ...p,
        ratio: 13,
      })))
    })
  }, [])


  const dialog = useRef(null)
  const [product, setProduct] = useState()
  const [isOpen, setOpen] = useState(false)
  const [isCreating, setCreating] = useState(false)

  function openDialog(product) {
    if (!product) {
      product = {
        name: '',
        description: '',
        categories: '',
        price: '',
        stock: '',
        point1: '',
        gender: 0,
        size: 100,
        barcodeNo: '',
        special: false,
        ages: {
          lowerAge: '',
          upperAge: '',
        },
      }
    }
    setProduct(product)
    setOpen(true)
  }
  if(session.status=== "loading") return <div>Yetkiniz yok</div>
  return (
    <AdminLayout>      
        <div className="w-full h-full overflow-x-auto">
          <div className="flex w-full h-24 items-center justify-center">
            <button className="w-48 h-14 rounded-xl bg-primary text-lg"
              onClick={() => {
                openDialog(null)
                setCreating(true)
              }}
            >
              Ürün Ekle
            </button>
          </div>
          <table className="w-full table-auto">
            <TableHead headers={headers} />
            <TableBody openDialog={(product) => {
              openDialog(product)
              setCreating(false)
            }} data={tableData} session={session} />
          </table>
        </div>
        <ProductModal isOpen={isOpen} setOpen={setOpen} product={product} dialog={dialog} isCreating={isCreating} session={session}/>
    </AdminLayout>
  )
}

function ProductModal({ product, dialog, isOpen, setOpen, isCreating,session }) {
  const [categories, setCategories] = useState([])
  const [allCategories, setAllCategories] = useState([])

  



  useEffect(() => {
    console.log(session);
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/admin/products/route`,{
      method:"GET",
      headers:{
        "userId":session?.data?.user?.dataValues?.id,
        "randomStr":session?.data?.user?.sessionToken
      }
    }).then((res)=>{
      console.log(res.status);
      if(res.status === 401) return signOut()
      else return res.json()
    }).then((productCategory) => {
      if(!productCategory) return
      if(!product?.id) return
      console.log(product.id);
      setCategories(() => {
        console.log(productCategory);
        const returnVal = productCategory.products.filter((item) => {
          if (item.id === product.id)
            return item.categories
          else return
        })
        console.log(returnVal);
        return returnVal[0].categories
      })
    })
  }, [product, isOpen])
  console.log(categories);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/categories`).then((res) => {
      if(res.status === 401) return signOut()
      return res.json()
    }).then(({categories}) => {
      const nonAllCategories = []
      for (let i = 0; i < categories.length; i++) {
        if (!categories[i].value || categories[i].value === 0)
          continue
        delete categories[i].id
        delete categories[i].icon
        nonAllCategories.push(categories[i])
      }
      setAllCategories(() => nonAllCategories)  
    })
    }
  , [])
  console.log(allCategories);
  console.log(product);
  // Make sure when dialog is closed, isOpen is set to false
  React.useEffect(() => {
    if (isOpen)
      dialog.current.showModal()
    else
      dialog.current.close()
  }, [isOpen])

  // Change props.isOpen when dialog is closed
  React.useEffect(() => {
    dialog.current.addEventListener('close', () => {
      setOpen(false)
    })
  }, [])

  const [createdProductId, setCreatedProductId] = useState()
  const [triggerUpload, setTriggerUpload] = useState(false)

  function create() {
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/admin/products/route`, {
      method: 'POST',
      headers: {
        "userId":session?.data?.user?.dataValues?.id,
        "randomStr":session?.data?.user?.sessionToken
      },
      body: JSON.stringify({
        ...product,
        categoryIds: categories.filter(category => category.isChecked).map(category => category.id),
      }),
    }).then((res) => {
      if(res.status === 401) return signOut()
      return res.json()
    }).then((res) => {
      if(!res) return
      console.log(res)
      setCreatedProductId(res.id)
      setTriggerUpload(true)
    })
  }

  async function update() {

    console.log(JSON.stringify({
      size: 100,
      special: product.special,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      ratio: 13,
      categoryIds:categories,
      barcodeNo:product.barcodeNo,
      ages: {
        lowerAge: product.ages.lowerAge,
        upperAge: product.ages.upperAge,
      },
    }));
    await fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/admin/products/route?id=${product.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        size: 100,
        special: product.special,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        ratio: 13,
        categoryIds:categories,
        barcodeNo:product.barcodeNo,
        ages: {
          lowerAge: product.ages.lowerAge,
          upperAge: product.ages.upperAge,
        },
      }),
      headers:{
        userId:session.data.user.session.userId,
        randomStr:session.data.user.session.randomStr
      }
    }).then((res) => {
      if(res.status === 401) return signOut()
    })
  }

  function createOrUpdate() {
    if (isCreating)
      create()
    else
      update()
  }

  console.log(product);
  return (
    <dialog ref={dialog}
      className={`flex flex-col h-fit w-full lg:w-1/2 py-10 justify-center items-center bg-white drop-shadow-lg rounded-lg relative transition-all ${isOpen ? 'scale-100' : 'scale-0'}`}>
      <form method="dialog">
        <button className="absolute w-8 h-8 right-5 top-5 stroke-black">
          <XmarkIcon />
        </button>
      </form>
      <div className="w-full flex justify-center flex-wrap gap-5">
    {isCreating
      ? <ImageFileInput uploadTo="productPdf" id={createdProductId} label="PDF" resolution={[24, 24]} triggerUpload={triggerUpload} onlyOnTrigger={true} session={session} />
      : <ImageFileInput uploadTo="productPdf" id={product?.id} label="PDF" resolution={[24, 24]} triggerUpload={triggerUpload} onlyOnTrigger={false} session={session} />
    }

    {isCreating
      ? <ImageFileInput uploadTo="product" id={createdProductId} label="İkon" resolution={[24, 24]} triggerUpload={triggerUpload} onlyOnTrigger={true} session={session} />
      : <ImageFileInput uploadTo="product" id={product?.id} label="İkon" resolution={[24, 24]} triggerUpload={triggerUpload} onlyOnTrigger={false} session={session} />
    }
        <div className="flex flex-wrap gap-2">
          <Input label="İsim" type="text" defaultValue={product ? product.name : ''} onChange={e => product.name = e.target.value} />
          {
            console.log(categories)
          }
          {
            console.log(allCategories)
          }
          {
            console.log()
          }
          <div className='flex justify-center items-center  '>

            <label className='mb-3 block text-base font-medium text-black '>
              Kategoriler
            </label>
            {
              console.log(categories,"categories")
            }
            {
              console.log(allCategories,"allCategories")
            }
{            
}            <Select
            value={
              categories?.map((item) => ({ value: item, label: allCategories.filter((val)=>val.value === item)[0]?.label}))
              }
            isMulti
            name="colors"
            options={allCategories}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(e) => {
              console.log(e);
              const values = e.map((item) => item.value)
              setCategories(values)
            }}
    />
          </div>
           {
            console.log(product?.barcodeNo)
           }
          <Input label="Fiyat" type="number" defaultValue={product ? product.price : ''} onChange={e => product.price = e.target.value} />
          <Input label="Stok" type="number" defaultValue={product ? product.stock : ''} onChange={e => product.stock = e.target.value} />
          <Input label="Alt Yaş" type="number" defaultValue={product ? parseInt(product.ages.lowerAge) : ''} onChange={e => product.ages.lowerAge = e.target.value} />
          <Input label="Üst Yaş" type="number" defaultValue={product ? parseInt(product.ages.upperAge) : ''} onChange={e => product.ages.upperAge = e.target.value} />
          <Input label="Barcode" type="text" defaultValue={product ? product?.barcodeNo :""} onChange={e => product.barcodeNo = e.target.value} />
          <label className='mb-3 block text-base font-medium text-black'>
            Özel
          </label>
           <input type="checkbox" defaultChecked={product?.special} onChange={(e) => {
            console.log(e.target.checked);
            
            product.special = e.target.checked}} />
        </div>
        <Textarea defaultValue={product ? product.description : ''} label="Açıklama" rows={5} placeholder="Açıklama giriniz..." onChange={e => product.description = e.target.value} />
      </div>
      <div className="flex justify-end gap-5 mt-10">
        <button onClick={() => dialog.current.close()} className="bg-custom-button-red text-white rounded-lg py-3 px-6 font-semibold text-sm">
          İptal
        </button>
        <button onClick={() => createOrUpdate()} type="submit" className="bg-primary text-white rounded-lg py-3 px-6 font-semibold text-sm">
          Kaydet
        </button>
      </div>
    </dialog>
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

function TableBody({ data, openDialog,session }) {
  console.log(data)
  return (
    <tbody>
      {
        data
        && data.map((row, index) => (
          <tr className="border-b border-stroke" key={index}>
            <td className="py-[18px] pl-6 pr-3">
              <div className="flex items-center">
                <div className="flex items-center">
                  <img
                    src={`${process.env.NEXT_PUBLIC_CDN_URL}/products/${row.id}`}
                    alt={row?.imageAlt}
                    className="mr-4 h-[50px] w-[60px] rounded object-cover object-center"
                  />
                  <p className="text-sm text-body-color">{row.name}</p>
                </div>
              </div>
            </td>
            <td className="py-[18px] px-4">
              <p className="text-sm text-body-color">{row.barcodeNo}</p>
            </td>
            <td className="py-[18px] px-4">
              <p className="text-sm text-body-color">{row.price} TL</p>
            </td>
            <td className="py-[18px] px-4">
              <p className="text-sm text-body-color">{row.stock}</p>
            </td>
            <td className="py-[18px] px-4">
              {(row.price/13).toFixed(2)}
              
            </td>
            <td className="py-[18px] px-4">
              <p className="text-sm text-body-color">{row.special === 1 ? "Özel":"Değil"}</p>
            </td>
            <td className="py-[18px] pl-4 pr-6">
              <TableDropdown product={row} session={session} openDialog={() => openDialog(row)} />
            </td>
          </tr>
        ))}
    </tbody>
  )
}

function TableDropdown({ product, openDialog,session }) {
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
  })

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

  function deleteProduct(id) {
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/admin/products/route?id=${id}`, {
      method: 'DELETE',
      headers:{
        userId:session?.data?.user?.session?.userId,
        randomStr:session?.data?.user?.session?.randomStr
      }
    }).then((res) => {
      if(res.status === 401) return signOut()
      return res.json()
    })
  }

  return (
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
        <button onClick={() => openDialog(product)}
          className="w-full rounded py-2 px-3 text-left text-sm hover:bg-gray-200">
          Düzenle
        </button>
        <button onClick={() => deleteProduct(product.id)} className="w-full rounded py-2 px-3 text-left text-sm text-custom-button-red hover:bg-gray-200">
          Kaldır
        </button>
      </div>
    </div>
  )
}

function Textarea({ label, placeholder, rows, defaultValue,onChange }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className='mb-3 block text-base font-medium text-black'>
        {label}
      </label>
      <textarea
        defaultValue={defaultValue}
        rows={rows}
        placeholder={placeholder}
        onChange={onChange}
        className='border-form-stroke text-body-color placeholder-body-color focus:border-primary active:border-primary w-full rounded-lg border-[1.5px] py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]'
      />
    </div>
  )
}

function Input({ label, type = 'text', placeholder, defaultValue, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className='mb-3 block text-base font-medium text-black'>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        className='border-form-stroke text-body-color placeholder-body-color focus:border-primary active:border-primary w-full rounded-lg border-[1.5px] py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]'
      />
    </div>
  )
}

function useClickOutside(handler) {
  const domNode = useRef()

  useEffect(() => {
    const maybeHandler = (event) => {
      if (!domNode.current.contains(event.target))
        handler()
    }

    document.addEventListener('mousedown', maybeHandler)

    return () => {
      document.removeEventListener('mousedown', maybeHandler)
    }
  })

  return domNode
}
// Handler hook for when Outside click dropdown close End Code====>>

function Dropdown({ label, options, setSelections }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const domNode = useClickOutside(() => {
    setDropdownOpen(false)
  })

  function handleOnChange(isChecked, label) {
    if (isChecked) {
      setSelections((prev) => {
        console.log(prev);
        return prev.map((item) => {
          if (item.label === label)
            return { ...item, isChecked: true }
          return item
        })
      })
    }
    else {
      setSelections((prev) => {
        return prev.map((item) => {
          if (item.label === label)
            return { ...item, isChecked: false }

          return item
        })
      })
    }
  }

  return (
    <>
      {/* <!-- ====== Dropdowns Section Start --> */}
      <div className="flex flex-wrap -mx-4">
        {/* one */}
        <div ref={domNode} className="w-full px-4 sm:w-1/2 lg:w-1/4">
          <div className="py-8 text-center">
            <div className="relative inline-block mb-8 text-left">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={'flex items-center px-5 py-3 text-base max-w-[150px] max-h-[50px] font-semibold text-white rounded bg-primary'}
              >
                Kategori Seç
                <span className="pl-2">
                  <svg
                    width="12"
                    height="7"
                    viewBox="0 0 12 7"
                    className="fill-current"
                  >
                    <path
                      d="M0.564864 0.879232C0.564864 0.808624 0.600168 0.720364 0.653125 0.667408C0.776689 0.543843 0.970861 0.543844 1.09443 0.649756L5.82517 5.09807C5.91343 5.18633 6.07229 5.18633 6.17821 5.09807L10.9089 0.649756C11.0325 0.526192 11.2267 0.543844 11.3502 0.667408C11.4738 0.790972 11.4562 0.985145 11.3326 1.10871L6.60185 5.55702C6.26647 5.85711 5.73691 5.85711 5.41917 5.55702L0.670776 1.10871C0.600168 1.0381 0.564864 0.967492 0.564864 0.879232Z" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.4719 0.229332L6.00169 4.48868L10.5171 0.24288C10.9015 -0.133119 11.4504 -0.0312785 11.7497 0.267983C12.1344 0.652758 12.0332 1.2069 11.732 1.50812L11.7197 1.52041L6.97862 5.9781C6.43509 6.46442 5.57339 6.47872 5.03222 5.96853C5.03192 5.96825 5.03252 5.96881 5.03222 5.96853L0.271144 1.50833C0.123314 1.3605 -5.04223e-08 1.15353 -3.84322e-08 0.879226C-2.88721e-08 0.660517 0.0936127 0.428074 0.253705 0.267982C0.593641 -0.0719548 1.12269 -0.0699964 1.46204 0.220873L1.4719 0.229332ZM5.41917 5.55702C5.73691 5.85711 6.26647 5.85711 6.60185 5.55702L11.3326 1.10871C11.4562 0.985145 11.4738 0.790972 11.3502 0.667408C11.2267 0.543844 11.0325 0.526192 10.9089 0.649756L6.17821 5.09807C6.07229 5.18633 5.91343 5.18633 5.82517 5.09807L1.09443 0.649756C0.970861 0.543844 0.776689 0.543843 0.653125 0.667408C0.600168 0.720364 0.564864 0.808624 0.564864 0.879232C0.564864 0.967492 0.600168 1.0381 0.670776 1.10871L5.41917 5.55702Z"
                    />
                  </svg>
                </span>
              </button>
              <div
                className={`absolute left-0 z-40 mt-2 w-44 rounded border-[.5px] border-light bg-white py-5 shadow-card transition-all ${dropdownOpen
                  ? 'top-full opacity-100 visible'
                  : 'top-[110%] invisible opacity-0'
                  }`}
              >

                {options && options.map((option, index) => (
                  <DropdownItem key={index} onChange={handleOnChange} defaultValue={option.isChecked}
                    label={option.label} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* End */}
      </div>
      {/* <!-- ====== Dropdowns Section End -->    */}
    </>
  )
}

function DropdownItem({ label, onChange, defaultValue }) {
  const [isChecked, setIsChecked] = useState(defaultValue)

  const handleCheckboxChange = () => {
    onChange && onChange(!isChecked, label)
    setIsChecked(!isChecked)
  }

  return (
    <button onClick={handleCheckboxChange}
      className="flex px-2 py-2 text-base font-semibold text-body-color hover:bg-primary hover:bg-opacity-5 hover:text-primary">
      <label className='flex cursor-pointer select-none items-center'>
        <div className='relative'>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={handleCheckboxChange}
            className='sr-only'
          />
          <div className='box mr-4 flex h-5 w-5 items-center justify-center rounded border'>
            <span className={`dot h-[10px] w-[10px] rounded-sm ${isChecked && 'bg-primary'}`}></span>
          </div>
        </div>
      </label>
      {label}
    </button>
  )
}

function FileInput({ label }) {
  const [files, setFiles] = useState([])
  const [images, setImages] = useState([])

  function handleOnChange(e) {
    setFiles(e.target.files)
  }

  useEffect(() => {
    const images = []
    for (let i = 0; i < files.length; i++)
      images.push(URL.createObjectURL(files[i]))

    setImages(images)
  }, [files])

  return (
    <div className="flex flex-col gap-2">
      <label className='mb-3 block text-base font-medium text-black'>
        {label}
      </label>
      {files.length === 0
        ? (
          <div className='relative'>
            <label
              htmlFor='file'
              className='flex min-h-[175px] w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-primary p-6'
            >
              <div>
                <input onChange={handleOnChange} type='file' name='file' id='file' multiple
                  accept=".jpg,.jpeg,.png,.webp" className='sr-only' />
                <span
                  className='mx-auto mb-3 flex h-[50px] w-[50px] items-center justify-center rounded-full border border-stroke bg-white'>
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M2.5013 11.666C2.96154 11.666 3.33464 12.0391 3.33464 12.4993V15.8327C3.33464 16.0537 3.42243 16.2657 3.57871 16.4219C3.73499 16.5782 3.94695 16.666 4.16797 16.666H15.8346C16.0556 16.666 16.2676 16.5782 16.4239 16.4219C16.5802 16.2657 16.668 16.0537 16.668 15.8327V12.4993C16.668 12.0391 17.0411 11.666 17.5013 11.666C17.9615 11.666 18.3346 12.0391 18.3346 12.4993V15.8327C18.3346 16.4957 18.0712 17.1316 17.6024 17.6004C17.1336 18.0693 16.4977 18.3327 15.8346 18.3327H4.16797C3.50493 18.3327 2.86904 18.0693 2.4002 17.6004C1.93136 17.1316 1.66797 16.4957 1.66797 15.8327V12.4993C1.66797 12.0391 2.04106 11.666 2.5013 11.666Z'
                      fill='#3056D3'
                    ></path>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M9.41074 1.91009C9.73618 1.58466 10.2638 1.58466 10.5893 1.91009L14.7559 6.07676C15.0814 6.4022 15.0814 6.92984 14.7559 7.25527C14.4305 7.58071 13.9028 7.58071 13.5774 7.25527L10 3.67786L6.42259 7.25527C6.09715 7.58071 5.56951 7.58071 5.24408 7.25527C4.91864 6.92984 4.91864 6.4022 5.24408 6.07676L9.41074 1.91009Z'
                      fill='#3056D3'
                    ></path>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M10.0013 1.66602C10.4615 1.66602 10.8346 2.03911 10.8346 2.49935V12.4994C10.8346 12.9596 10.4615 13.3327 10.0013 13.3327C9.54106 13.3327 9.16797 12.9596 9.16797 12.4994V2.49935C9.16797 2.03911 9.54106 1.66602 10.0013 1.66602Z'
                      fill='#3056D3'
                    ></path>
                  </svg>
                </span>
                <span className='text-base text-body-color'>
                  Sürükle bırak veya
                  <span className='text-primary underline'> seç </span>
                </span>
              </div>
            </label>
          </div>
          )
        : (
          <>
            {
              images.map((image, index) => (
                <Image key={index} src={image} width={200} height={200} className="w-[100px] h-[100px] object-contain"
                  alt={files[index].name} />
              ))
            }
          </>
          )}
    </div>
  )
}
