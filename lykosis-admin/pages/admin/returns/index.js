import React, { useEffect, useRef, useState } from 'react'
import AdminLayout from '@/components/Admin/AdminLayout'
import XmarkIcon from '@/components/icons/XmarkIcon'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FixedSizeList } from 'react-window'

export default function Returns() {

  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(true)
  const [allProducts, setAllProducts] = useState([])
  const session = useSession()
  const router = useRouter()
  // DO THIS IN THE 
  useEffect(() => {
    // Fetch data from API
    if (session.status === 'loading') return
    if (session.status === 'unauthenticated') {
      signOut().then(() => {
        router.push('/api/auth/signin')
      })
    }
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/adminPrivilages/refunds`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        userId: session.data.user?.dataValues.id,
        randomStr: session.data.user?.sessionToken,
      },
    }).then((res) => {
      if (res.status === 401) return signOut()
      return res.json()
    }).then((data) => {
      setTableData(data)
      setLoading(false)
    })
  }, [session])
  useEffect(() => {
    if (session.status === 'loading') return
    if (session.status === 'unauthenticated') {
      signOut().then(() => {
        router.push('/api/auth/signin')
      })
    }
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/products`, {
      method: 'GET',
    }).then((res) => {
      if (res.status === 401) return signOut()
      return res.json()
    }).then((data) => {
      console.log(data);
      const returnVal = {}
      data.products.forEach((product) => {
        returnVal[product.id] = product
      })
      setAllProducts(returnVal)
    })
  }, [session])

  const headers = [
    { name: 'İSİM', styles: 'min-w-[300px]' },
    { name: 'SİPARİŞ NUMARASI', styles: 'min-w-[280px]' },
    { name: 'DURUM', styles: 'min-w-[140px]' },
    { name: 'SİPARİŞ DETAYLARI', styles: 'min-w-[140px]' },
  ]

  const dialogRef = useRef(null)
  const [returnData, setReturnData] = useState(tableData[0])
  const [isOpen, setOpen] = useState(false)

  const openDialog = (data) => {
    setReturnData(data)
    setOpen(true)
  }

  return (
        <AdminLayout>
            <div className="max-w-full w-full h-full overflow-x-auto rounded-xl shadow-lg">
                    <TableHead headers={headers}/>
                    <TableBody openDialog={openDialog} data={tableData}/>
            </div>
            <ReturnDialog dialog={dialogRef} isOpen={isOpen} setOpen={setOpen} data={returnData} allProducts={allProducts} session={session}/>
        </AdminLayout>
  )
}

function ReturnDialog({ dialog, isOpen, setOpen, data,allProducts,session}) {
  
  console.log(data);
  // Make sure when dialog is closed, isOpen is set to false
  React.useEffect(() => {
    if(!dialog.current) return
    if (isOpen)
      dialog.current.showModal()
    else
      dialog.current.close()
  }, [isOpen,dialog])

  // Change props.isOpen when dialog is closed
  React.useEffect(() => {
    if(!dialog.current) return
    dialog.current.addEventListener('close', () => {
      setOpen(false)
    })
    
  }, [dialog,setOpen])

  const statusOptions = [
    'Onaylandı',
    'Reddedildi',
  ]

  const [status, setStatus] = useState("Onaylandı")

  // useEffect(() => {
  //   if(!data) return
  //   setStatus(data.status)
  // }, [data])

  function handleSelectChnage(e) {
    console.log(e.target.value);
    setStatus(e.target.value)
  }
  if(!data) return 


  return (
        <dialog ref={dialog}
                className={`flex flex-col justify-center p-20 bg-white drop-shadow-lg rounded-lg relative transition-all ${isOpen ? 'scale-100' : 'scale-0'}`}>
            <form method="dialog">
                <button className="absolute w-8 h-8 right-5 top-5 stroke-black">
                    <XmarkIcon/>
                </button>
            </form>

            <div className="flex flex-wrap gap-2 items-center overflow-auto">
                {Object.keys(data.products).map((product, index) => (
                    <div key={index} className="flex flex-col text-left bg-white drop-shadow-lg p-4 rounded-lg border">
                        <p><span className="font-semibold">Ürün Adı: </span> {allProducts[product].name}</p>
                        <p><span className="font-semibold">Ürün Adeti: </span> {data.products[product].count}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-5 ">

                <div className="flex flex-col justify-center items-center mt-5">
                    <p><span
                        className="font-semibold">Sipariş Tarihi: </span>{new Date(data.createdAt).toLocaleString('tr')}
                    </p>
                    <p><span className="font-semibold">Sipariş Fiyatı: </span>{data.price}</p>
                    <p><span className="font-semibold">Sipariş Puanı: </span>{data.point1}</p>
                    <p><span className="font-semibold">Sipariş Ürün Sayısı: </span>{Object.values(data.products).reduce((sum,val)=>sum+val.count*100,0)/100}</p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center items-center mt-5">
                    <Select onChange={handleSelectChnage} disabled={!data.active}  options={statusOptions} label="İade Durumu" defaultValue={status}/>
                    {

                    }
                    {
                      
                    
                      // data.active &&
                      <button className='w-24 h-12 border bg-primary rounded-xl mt-auto ml-12' disabled={!data.active}
                      onClick={()=>{
                        console.log(status);
                        const accepted = status === "Onaylandı" ? true:false
                        console.log(data)
                        console.log(session.data.user.session)
                         fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/refund`,{
                           method:'PATCH',
                           body:JSON.stringify({
                             refundId:data.id,
                             accepted:accepted
                           }),
                           headers:{
                             userid:session.data.user.session.userId,
                             randomstr:session.data.user.session.randomStr,
                           }
                         }).then((res)=>{
                            if(res.status === 401) return signOut()
                            return res.json()
                         })
                      }}
                      >
                        Kaydet
                      </button>
                    }
                </div>
            </div>
        </dialog>
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

function Select({ label, options, onChange, defaultValue,disabled }) {
  return (
        <div className="flex flex-col gap-2 w-48">
            <label className='mb-3 block text-base font-medium text-black'>
                {label}
            </label>
            <div className='relative'>
                <select onChange={onChange}
                disabled={disabled}
                        className='border-form-stroke text-body-color focus:border-primary active:border-primary w-full appearance-none rounded-lg border-[1.5px] py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]'>
                    {disabled ? <option key={5} >İncelendi</option> : options.map((option, index) =>
                        <option key={index} selected={option === defaultValue} value={option}>{option}</option>,
                    )}
                </select>
                <span
                    className='border-body-color absolute right-4 top-1/2 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2'></span>
            </div>
        </div>
  )
}

function TableHead({ headers }) {
  return (
        <div className="bg-[#F9FAFB] text-left flex ">
            {headers.map((header, index) => (
                <div
                    className={`py-4 px-4 first:pl-11 last:pr-11 text-base font-medium uppercase text-dark flex justify-center  w-1/4 ${header.styles}`}
                    key={index}
                >
                    {header.name}
                </div>
            ))}
        </div>
  )
}

function TableBody({ data, openDialog,loading }) {
  if(loading)return <div className='w-full flex justify-center items-center text-xl text-center'>Yükleniyor</div>
  if(Object.keys(data)<= 0 ) return <div className='w-full flex justify-center items-center text-xl text-center'>Veri Yok</div>
  console.log(data);
  return (
    <FixedSizeList
    width="100%"
    height={950}
    itemSize={100}
    itemCount={Object.keys(data.refunds).length}
    itemData={{data,openDialog}}
    className='w-full h-full'
    >
      {RenderData}
    </FixedSizeList>
    
  )
}
const RenderData = ({ data,index,style}) =>{
  console.log(data.data.refunds[index]);
  return <div key={index}  style={{...{display:"flex" , justifyContent:"center", alignItems:"center",width:"100%"},...style}} >
  
  <div className="py-5 px-4 w-1/4 flex justify-center">
      <p className="text-body-color">{data.data.refunds[index].id}</p>
  </div>
  <div className="py-5 px-4 w-1/4 flex justify-center">
      {data.data.refunds[index].active
        ?
        <span
              className="inline-flex items-center justify-center rounded-full bg-[#34D399] bg-opacity-[15%] py-2 px-4 text-xs font-semibold text-[#34D399]">
              Aktif
          </span>
       
        :  (
          <span
              className="inline-flex  rounded-full bg-red-600 bg-opacity-[15%] py-2 px-4 text-xs font-semibold text-red-600">
              Incelendi
          </span>
          )}
    
     
  </div>
  <div className="py-5 px-4 text-left w-1/4 flex flex-col items-center">
      <p className="text-body-color text-sm"><span
          className="font-semibold">Sipariş Tarihi:</span> {new Date(data.data.refunds[index].createdAt).toLocaleString('tr')}
      </p>
      <p className="text-body-color text-sm"><span
          className="font-semibold">Ürün Sayısı:</span> {Object.keys(data.data.refunds[index].products).length}</p>
      <p className="text-body-color text-sm"><span
          className="font-semibold">Sipariş Fiyatı:</span> {data.data.refunds[index].price}</p>
      <p className="text-body-color text-sm"><span
          className="font-semibold">Verilen Puan:</span> {data.data.refunds[index].point1}</p>
  </div>
  <div className="py-5 px-4 pr-11 text-center w-1/4 flex justify-center">
      <button onClick={() => data.openDialog(data.data.refunds[index])}
              className="text-primary border-primary hover:bg-primary inline-block rounded-full border py-2 px-5 text-sm font-medium hover:text-white">
          İncele
      </button>
  </div>
</div>
}
