import React, { useEffect, useRef, useState } from 'react'
import AdminLayout from '@/components/Admin/AdminLayout'
import XmarkIcon from '@/components/icons/XmarkIcon'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FixedSizeList } from 'react-window'

export default function Orders() {
  const [tableData, setTableData] = useState([])
  const [loading,setLoading] = useState(false)
  const session = useSession()
  const router = useRouter()
  const [allProducs, setAllProducts] = useState([])

  const [filteredData, setFilteredData] = useState([])


  const [filterId, setFilterId] = useState("")

  useEffect(() => {
    if (session.status === 'loading') return
    if(session.status === "unauthenticated"){
      signOut().then(()=>{
        router.push("/api/auth/signin")
      })
    }
    console.log("triggered");
    let temp=[]
    
    if(!!filterId){
      tableData.forEach((data)=>{
        if(data.id.toString() === filterId){
          temp.push(data)
        }})
      }
    if(!!filterId){
      if(temp.length === 0){
        temp= tableData
      }
    }
    console.log(temp);
    setFilteredData(temp)
  }, [filterId]) 
    


  
  
  

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/products`).then((res) => {
      if (res.status === 401) return signOut()
      return res.json()
    }).then((res) => {
      const temp = {}
      res.products.forEach((product) => {
        temp[product.id] = product
      })
      setAllProducts(temp)
    })
  }, [])
 
      
  function intStatusToText(status) {
    switch (status) {
      case 0:
        return 'Ödeme yapılmadı'
      case 1:
        return 'Ödeme yapılmadı'
      case 2:
        return "Kargoya verilmesi bekleniyor"
      case 3:
        return 'Yola çıktı'
      case 4:
        return 'Teslim edildi'
      case 5:
        return 'İade bekleniyor'
      case 6:
        return 'İade edildi'
      case 7:
        return 'İade reddedildi'
      case 8:
        return 'İptal edildi'
    }

    return 'İptal edildi'
  }
  

  useEffect(() => {
    if (session.status === 'loading') return
    if(session.status === "unauthenticated"){ 
    signOut().then(()=>{
      router.push("/api/auth/signin") 
    }) 
    }
    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/admin/orders`,{
      method:"GET",
      headers:{
        "Content-Type":"application/json",
        "userId":session.data.user?.dataValues.id,
        "randomStr":session.data.user?.sessionToken
      }
    })
    .then(res=>{
      if(res.status === 401) return signOut()
      console.log(res);
      return res.json()
    })
    .then(
      res=>{
        if(!res) return
        return res.orders
      }
    ).then(orders =>{
      const parsedTableData = orders.map((o) => {
        return {
          id: o.id,
          name: `${o.name} ${o.surname}`,
          price: o.price,
          status: intStatusToText(o.status),
          address: `${o?.addressData?.city} ${o?.addressData?.district} ${o?.addressData?.neighborhood} ${o?.addressData?.address}`,
          products: Object.keys(o.products).map((key) => {
            return {
              id:key,
              name:allProducs?.[key]?.name,
              amount:o.products[key]?.count,
            }
          })
      }
    })
      setLoading(false)
      setTableData(parsedTableData)
    })

  }, [session,router,allProducs])

  const headers = [
    { name: 'İSİM', styles: 'min-w-[300px]' },
    { name: 'FİYAT', styles: 'min-w-[280px]' },
    { name: 'DURUM', styles: 'min-w-[140px]' },
  ]

  const dialogRef = useRef(null)
  const [isOpen, setOpen] = useState(false)
  const [product, setProduct] = useState()

  function openDialog(product) {
    setProduct(prev => product)
    setOpen(prev => true)
  }

  return (
        <AdminLayout>
          <div>
          <label id="filterId" className="block text-base font-semibold text-gray-600">
  Id
</label>
<input 
  type="text" 
  name="filterId" 
  id="filterId" 
  autoComplete="filterId" 
  value={filterId} 
  onChange={(e)=>setFilterId(e.target.value)} 
  className="mt-1 block w-36 rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-300 ease-in-out mb-1 "
/>

            



          </div>
        
            <div className="max-w-full w-full h-full overflow-x-auto rounded-xl shadow-lg">
                    <TableHead headers={headers}/>
                    <TableBody openDialog={openDialog} data={
                      !!filterId ? filteredData : tableData
                    }/>
            </div>
            {isOpen
              ? <OrderDialog dialogRef={dialogRef} isOpen={isOpen} setOpen={setOpen} product={product} session={session} allProducs={allProducs}/>
              : <></>}
        </AdminLayout>
  )
}

function OrderDialog({ dialogRef, isOpen, setOpen, product,session,allProducs }) {
  console.log(product);
  function statusToInt(status) {
    console.log(status);
    switch (status) {
      case 'Ödeme yapılmadı':
        return 0
      case 'Kargoya verilmesi bekleniyor':
        return 2
      case 'Yola çıktı':
        return 3
      case 'Ulaştı':
        return 4
      case 'İade bekleniyor':
        return 5
      case 'İade edildi':
        return 6
      case 'İade reddedildi':
        return 7
      case 'İptal edildi':
        return 8
    }

    return 8
  }
  const [status, setStatus] = useState(null)
  const [trackingNumber, setTrackingNumber] = useState(null)
  const router = useRouter()
  React.useEffect(() => {
    if (isOpen)
      dialogRef.current.showModal()
    else
      dialogRef.current.close()
  }, [isOpen,dialogRef])

  // Change props.isOpen when dialog is closed
  React.useEffect(() => {
    dialogRef.current.addEventListener('close', () => {
      setOpen(false)
    })
  }, [dialogRef, setOpen])


  const handleStatusChange = (e) => {
    setStatus(e.target.value)
  }

  const statusOptions = [
    "Kargoya verilmesi bekleniyor",
    "Yola çıktı",
    "Ulaştı",
    "İptal edildi"
  ]

  useEffect(() => {
    setStatus(product.status)
  }, [product])

  return (
        <dialog ref={dialogRef}
                className={`flex flex-col justify-center p-20 bg-white drop-shadow-lg rounded-lg relative transition-all ${isOpen ? 'scale-100' : 'scale-0'}`}>
            <form method="dialog">
                <button className="absolute w-8 h-8 right-5 top-5 stroke-black">
                    <XmarkIcon/>
                </button>
            </form>

            <div className="flex flex-wrap gap-3">
                <span>
                    <h5 className="text-dark text-sm font-medium">Sipariş ID</h5>
                    <p className="text-body-color">{product.id}</p>
                </span>
                <span>
                    <h5 className="text-dark text-sm font-medium">Adres</h5>
                    <p className="text-body-color">{product.address}</p>
                </span>
                <span>
                    <h5 className="text-dark text-sm font-medium">Ürünler</h5>
                    <div className="flex flex-col gap-2">
                        {product.products.map((product, index) => (
                            <div key={index} className="flex flex-col gap-1">
                              {
                                console.log(product)
                              }
                              {
                                console.log(allProducs)
                              }
                                <span className="text-body-color">{allProducs[product.id].name}</span>
                                <span className="text-body-color">{product.amount} Adet</span>
                            </div>
                        ))}
                    </div>
                </span>
              

                <Select defaultValue={status} onChange={handleStatusChange} disabled={product.status === "Yola çıktı" || product.status === "Kargoya verilmesi bekleniyor"?false:true} options={product.status === "Kargoya verilmesi bekleniyor" || product.status === "Yola çıktı" ? statusOptions: ["Onaylanamaz"]}/>
               
                {status === 'Yola çıktı'? (
                    <div className="flex flex-col gap-2">
                    <label className='mb-3 block text-base font-medium text-black'>
                        Takip Numarası
                    </label>
                    <input
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder={"Takip Numarası"}
                        defaultValue={product.trackingNumber}
                        className='border-form-stroke text-body-color placeholder-body-color focus:border-primary active:border-primary w-full rounded-lg border-[1.5px] py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]'
                    />
                </div>
                )
              : <></>
              }
            </div>

            <div className="flex justify-center gap-5 mt-10">
                <button onClick={() => dialogRef.current.close()} className="bg-custom-button-red text-white rounded-lg py-3 px-6 font-semibold text-sm">
                    İptal
                </button>
                {
                  console.log(session.data.user.session.userId)
                }
                {
                  console.log(session.data.user.session.randomStr)
                }
                <button className="bg-primary text-white rounded-lg py-3 px-6 font-semibold text-sm" onClick={()=>{
                  fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/adminPrivilages/order`,{
                    method:"PATCH",
                    headers:{
                      "Content-Type":"application/json",
                      "userId":session.data.user.session.userId,
                      randomStr:session.data.user.session.randomStr
                    },
                    body:JSON.stringify({
                      status:statusToInt(status),
                      orderId:product.id,
                      trackingNumber:status === "Yola çıktı" ? trackingNumber : ""
                    })
                  }).then((res)=>{
                    if(res.status === 401) return signOut()
                    return res.json()
                  }
                  ).then(()=>{
                    dialogRef.current.close()
                    router.reload()

                  })
                }}>
                    Kaydet
                </button>
            </div>
        </dialog>
  )
}

function TableHead({ headers }) {
  return (
        <div className="bg-[#F9FAFB] text-left flex justify-center">
            {headers.map((header, index) => (
                <div
                    className={`py-4 px-4 first:pl-11 last:pr-11 text-base font-medium uppercase text-dark w-1/3 flex justify-center ${header.styles}`}
                    key={index}
                >
                    {header.name}
                </div>
            ))}
        </div>
  )
}

function TableBody({ data, openDialog ,loading}) {
  console.log(data);
  if(loading)return <div className='w-full flex justify-center items-center text-xl text-center'>Yükleniyor</div>
  if(data.length<= 0 ) return <div className='w-full flex justify-center items-center text-xl text-center'>Veri Yok</div>
  return (
        <FixedSizeList
        width="100%"
        height={950}
        itemSize={100}
        itemCount={Object.keys(data).length}
        itemData={{data,openDialog}}
        className='w-full h-full'
        >
          {RenderData}
        </FixedSizeList>

  )
}

const RenderData = ({data,index,style}) => {
  console.log(data.data);
  return <div key={index}  style={{...{display:"flex" , justifyContent:"center", alignItems:"center",width:"100%"},...style}}>
     <div className="flex items-center justify-center w-1/5 py-5 px-4 pl-11">
      <div className="flex items-center">
          <div>
              <h5 className="text-dark text-sm font-medium">{data.data[index].id}</h5>
          </div>
      </div>
  </div>
  <div className="flex items-center justify-center w-1/5 py-5 px-4 pl-11">
      <div className="flex items-center">
          <div>
              <h5 className="text-dark text-sm font-medium">{data.data[index].name}</h5>
          </div>
      </div>
      
  </div>
  <div className=" flex w-1/5 items-center justify-center py-5 px-4">
      <p className="text-body-color">{data.data[index].price} TL</p>
  </div>
  <div className=" py-5 px-4">
      <p className="text-body-color">{data.data[index].status}</p>
  </div>
  <div className="flex items-center justify-center w-1/5 py-5 px-4 pl-11">
      <div className="flex items-center">
          <div>
              <h5 className="text-dark text-sm font-medium">{data.data[index].address}</h5>
          </div>
      </div>
  </div>
  <div className=" py-5 px-4 pr-11 text-center">
      <button onClick={() => data.openDialog(data.data[index])}
              className="text-primary border-primary hover:bg-primary inline-block rounded-full border py-2 px-5 text-sm font-medium hover:text-white">
          İncele
      </button>
  </div>
</div>
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
                    {options.map((option, index) =>
                        <option key={index} selected={option === defaultValue} value={option}>{option}</option>,
                    )}
                </select>
                <span
                    className='border-body-color absolute right-4 top-1/2 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2'></span>
            </div>
        </div>
  )
}
