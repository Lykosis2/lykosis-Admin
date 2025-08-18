import React, { useEffect, useState } from 'react'
import AdminLayout from '@/components/Admin/AdminLayout'
import XmarkIcon from '@/components/icons/XmarkIcon'
import { FixedSizeList } from 'react-window'
import { signOut, useSession } from 'next-auth/react'

export default function Members() {
  const [tableData, setTableData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isimFilter, setIsimFilter] = useState('')
  const [uyelikTipiFilter, setUyelikTipiFilter] = useState()
  const [durumFilter, setDurumFilter] = useState('')
  const [kariyerFilter, setKariyerFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const session =useSession()
  console.log(session);
  useEffect(() => {
  
    if(!session.data) return
    if(!session.data.user) return
      fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/adminPrivilages/allUsers`,{
        headers:{
          'Content-Type':'application/json',
          userId:session.data?.user?.dataValues.id,
          randomStr:session.data?.user?.sessionToken
        }
      }).then((res) => {
        if (res.status === 401) return signOut()
        return res.json()
      }).then(res => {
        console.log(res)
        setLoading(false)
        setTableData(res.allUsers)
      },
      )
       
  }, [])

  const headers = [
    { name: 'İSİM', styles: 'min-w-[300px]' },
    { name: 'ÜYELİK TİPİ', styles: 'min-w-[280px]' },
    { name: 'DURUM', styles: 'min-w-[140px]' },
    { name: 'KARİYER', styles: 'min-w-[140px]' },
    { name: '', styles: 'min-w-[140px]' },
  ]

  const dialogRef = React.useRef(null)
  const [isOpen, setOpen] = React.useState(false)
  const [member, setMember] = React.useState(tableData || {})

  const [order, setOrder] = useState('İSİM')
  const [orderBy, setOrderBy] = useState('as   ')

  const openDialog = (member) => {
    setMember(member)
    setOpen(true)
  }

  useEffect(() => {
    console.log(tableData)
    if (Object.keys(tableData).length === 0)
      return
    console.log(orderBy)
    console.log(order)
    switch (order) {
      case 'İSİM':
        if (orderBy === 'asc') {
          const sortedObject = {}

          Object.keys(tableData)
            .sort((a, b) => tableData[a].name.localeCompare(tableData[b].name))
            .forEach((key) => {
              sortedObject[key] = tableData[key]
            })
          console.log(sortedObject)
          setTableData(sortedObject)
        }
        else {
          const sortedObject = {}
          Object.keys(tableData)
            .sort((a, b) => tableData[a].name.localeCompare(tableData[b].name)).reverse()
            .forEach((key) => {
              sortedObject[key] = tableData[key]
            })
          console.log(sortedObject)
          setTableData(sortedObject)
        }
        break
      case 'ÜYELİK TİPİ':
        if (orderBy === 'asc') {
          const sortedObject = {}
          const keys = Object.keys(tableData)
          keys.sort((keyA, keyB) => {
            const userTypeA = tableData[keyA].userType
            const userTypeB = tableData[keyB].userType

            // Sort userType 1 before userType 0
            if (userTypeA === 1 && userTypeB === 0)
              return -1
            else if (userTypeA === 0 && userTypeB === 1)
              return 1
            else
              return 0
          })
          for (const key of keys)
            sortedObject[key] = tableData[key]

          setTableData(sortedObject)
        }
        else {
          const sortedObject = {}
          const keys = Object.keys(tableData)
          keys.sort((keyA, keyB) => {
            const userTypeA = tableData[keyA].userType
            const userTypeB = tableData[keyB].userType

            // Sort userType 1 before userType 0
            if (userTypeA === 0 && userTypeB === 1)
              return -1
            else if (userTypeA === 1 && userTypeB === 0)
              return 1
            else
              return 0
          })
          for (const key of keys)
            sortedObject[key] = tableData[key]

          setTableData(sortedObject)
        }
        break
      case 'DURUM':
        if (orderBy === 'asc') {
          const sortedData = {}
          const keys = Object.keys(tableData)

          // Sort the keys based on userType and active
          keys.sort((keyA, keyB) => {
            const itemA = tableData[keyA]
            const itemB = tableData[keyB]

            // Sort userType 0 to the back
            if (itemA.userType === 0 && itemB.userType !== 0) {
              return 1
            }
            else if (itemA.userType !== 0 && itemB.userType === 0) {
              return -1
            }
            else {
              // If userType is the same, sort by the active flag
              if (itemA.userType === 1 && itemA.active === false)
                return 1
              else if (itemB.userType === 1 && itemB.active === false)
                return -1
            }

            return 0 // Maintain the relative order for other cases
          })

          // Create a new object with the sorted keys
          for (const key of keys)
            sortedData[key] = tableData[key]

          console.log(sortedData)
          setTableData(sortedData)
        }
        else {
          const sortedData = {}
          const keys = Object.keys(tableData)

          // Sort the keys based on userType and active in the reverse order
          keys.sort((keyA, keyB) => {
            const itemA = tableData[keyA]
            const itemB = tableData[keyB]

            // Sort userType 0 to the front
            if (itemA.userType === 0 && itemB.userType !== 0) {
              return -1
            }
            else if (itemA.userType !== 0 && itemB.userType === 0) {
              return 1
            }
            else {
              // If userType is the same, sort by the active flag in reverse
              if (itemA.userType === 1 && itemA.active === false)
                return -1
              else if (itemB.userType === 1 && itemB.active === false)
                return 1
            }

            return 0 // Maintain the relative order for other cases
          })

          // Create a new object with the sorted keys
          for (const key of keys)
            sortedData[key] = tableData[key]

          console.log(sortedData)
          setTableData(sortedData)
        }
        break
      case 'KARİYER':
        if (orderBy === 'asc') {
          const sortedData = {}
          const keys = Object.keys(tableData)

          // Sort the keys based on userType, real_title
          keys.sort((keyA, keyB) => {
            const itemA = tableData[keyA]
            const itemB = tableData[keyB]

            // Sort userType 0 to the bottom
            console.log(itemA.userType)
            console.log(itemB.userType)
            if (itemA.userType === 0 && itemB.userType !== 0) {
              console.log('burda')
              return 1
            }
            else if (itemA.userType !== 0 && itemB.userType === 0) {
              console.log('burda')
              return -1
            }
            if (itemA.userType === 1 && itemB.userType === 1) {
              console.log('burda')
              console.log(itemA.real_title)
              console.log(itemB.real_title)
              return itemA.real_title - itemB.real_title < 0 ? 1 : -1
            }
            return 0 // Maintain the relative order for other cases
          })

          // Create a new object with the sorted keys
          for (const key of keys)
            sortedData[key] = tableData[key]

          console.log(sortedData)
          setTableData(sortedData)
        }
        else {
          const sortedData = {}
          const keys = Object.keys(tableData)

          // Sort the keys based on userType, real_title
          keys.sort((keyA, keyB) => {
            const itemA = tableData[keyA]
            const itemB = tableData[keyB]

            // Sort userType 0 to the bottom
            console.log(itemA.userType)
            console.log(itemB.userType)
            if (itemA.userType === 0 && itemB.userType !== 0) {
              console.log('burda')
              return -1
            }
            else if (itemA.userType !== 0 && itemB.userType === 0) {
              console.log('burda')
              return 1
            }
            if (itemA.userType === 1 && itemB.userType === 1) {
              console.log('burda')
              console.log(itemA.real_title)
              console.log(itemB.real_title)
              return itemB.real_title - itemA.real_title < 0 ? 1 : -1
            }
            return 0 // Maintain the relative order for other cases
          })

          // Create a new object with the sorted keys
          for (const key of keys)
            sortedData[key] = tableData[key]

          console.log(sortedData)
          setTableData(sortedData)
        }
        break
    }
  }, [order, orderBy])

  // Filter logic
  useEffect(() => {
    const filteredData = Object.keys(tableData).filter((key) => {
      const item = tableData[key]

      // Check isimFilter
      if (!!isimFilter && !item.name.includes(isimFilter))
        return false

      // Check uyelikTipiFilter
      if (uyelikTipiFilter === '1' && item.userType !== 0)
        return false
      else if (uyelikTipiFilter === '2' && item.userType !== 1)
        return false

      // Check durumFilter
      if (durumFilter === '1' && (item.userType === 0 || !item.active))
        return false
      else if (durumFilter === '2' && (item.active))
        return false

      // Check kariyerFilter
      if (!!kariyerFilter && !kariyerFilter.includes(item.real_title.toString()))
        return false

      return true
    })
    const returnVal = {}
    filteredData.forEach((key) => {
      returnVal[key] = tableData[key]
    })
    setFilteredData(returnVal)
  }, [isimFilter, uyelikTipiFilter, durumFilter, kariyerFilter])

  return (
        <>
            <AdminLayout>
                <div className="max-w-full w-full h-full overflow-x-auto rounded-xl shadow-lg">
                    <div className="w-full h-24 flex gap-1 items-center justify-center">
                        <label className="flex items-center" htmlFor="isimFilter">
                            İsim:
                        </label>
                        <input type="text" id="isimFilter" className="w-[15%] h-10 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primary px-4 ml-4" onChange={(e) => {
                          setIsimFilter(e.target.value)
                        }}/>

                        <label className="flex items-center">
                            Üyelik Tipi:
                        </label>
                        <select className="w-[15%] h-10 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primary px-4 ml-4" onChange={(e) => {
                          setUyelikTipiFilter(e.target.value)
                        }}>
                            <option value="0">Hepsi</option>
                            <option value="1">Müşteri</option>
                            <option value="2">Üye</option>
                        </select>

                        <label className="flex items-center" >
                            Durum:
                        </label>
                        <select className="w-[15%] h-10 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primary px-4 ml-4" onChange={(e) => {
                          setDurumFilter(e.target.value)
                        }}>
                            <option value="0">Hepsi</option>
                            <option value="1">Aktif</option>
                            <option value="2">Deaktif</option>

                        </select>

                        <label className="flex items-center">
                            Kariyer:
                        </label>
                        <input type="number" className="w-[15%] h-10 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primary px-4 ml-4" onChange={(e) => {
                          setKariyerFilter(e.target.value)
                        }} />

                    </div>

                      
                        <TableHead headers={headers} setOrder={setOrder} setOrderBy={setOrderBy}/>
                        <TableBody data={Object.keys(filteredData).length > 0 || !!isimFilter || !!durumFilter || !!kariyerFilter || !!uyelikTipiFilter ? filteredData : tableData} setMember={openDialog} loading={loading}/>
                </div>
                <MemberModal isOpen={isOpen} setOpen={setOpen} member={member} dialogRef={dialogRef}/>
            </AdminLayout>
        </>
  )
}

function MemberModal({ member, dialogRef, isOpen, setOpen }) {
  function incremnetBetweenTwoNumbers(a, b) {
    if (a === 0 && b === 0)
      return 0
    if (a === 0)
      return 100
    return Number.parseFloat(String(((b - a) / a) * 100)).toFixed(2)
  }

  // Make sure when dialog is closed, isOpen is set to false
  React.useEffect(() => {
    if (isOpen)
      dialogRef.current.showModal()
    else
      dialogRef.current.close()
  }, [isOpen])

  // Change props.isOpen when dialog is closed
  React.useEffect(() => {
    dialogRef.current.addEventListener('close', () => {
      setOpen(false)
    })
  }, [])
  

  return (
        <dialog ref={dialogRef} className={`flex flex-col h-fit w-fit py-10 justify-center items-center bg-white drop-shadow-lg rounded-lg relative transition-all ${isOpen ? 'scale-100' : 'scale-0'}`}>
            <form method="dialog">
                <button className="absolute w-8 h-8 right-5 top-5 stroke-black">
                    <XmarkIcon/>
                </button>
            </form>
            <div className="mb-8 flex items-center gap-5">
                <div className="flex items-center gap-3">
                    <div className="mr-4">
                        <img
                            src={member.profilepicture}
                            width={112}
                            height={112}
                            alt={member.name}
                            className="w-28 rounded-full"
                        />
                    </div>
                    <div>
                        <h5 className="text-dark text-base font-medium">{member.name}</h5>
                        <p className="text-body-color text-sm">{member.email}</p>
                        <p className="text-body-color text-sm">{member.phone}</p>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="flex flex-col justify-between text-center">
                        <p className="text-body-color text-xl">Üye Durumu</p>
                        {member.active
                          ? (
                            <span
                                className="inline-flex items-center justify-center rounded-full bg-green-600 bg-opacity-[15%] py-2 px-4 text-xs font-semibold text-[#34D399]">
                  Aktif
                </span>
                            )
                          : (
                            <span
                                className="inline-flex items-center justify-center rounded-full bg-red-600 bg-opacity-[15%] py-2 px-4 text-xs font-semibold text-red-600">
                  Deaktif
                </span>
                            )}
                    </div>
                    <div className="flex flex-col justify-between text-center">
                        <p className="text-body-color text-xl">Kariyer</p>

                        <span
                            className="inline-flex items-center justify-center rounded-full bg-green-600 bg-opacity-[15%] py-2 px-4 text-xs font-semibold text-[#34D399]">
                {member.userType === 1
                  ? member.real_title === 1
                    ? 'Bronz'
                    : member.real_title === 2
                      ? 'Gümüş'
                      : member.real_title === 3
                        ? 'Altın'
                        : member.real_title === 4
                          ? 'Platin'
                          : member.real_title === 5
                            ? 'Elmas'
                            : member.real_title === 6
                              ? 'Master'
                              : member.real_title === 7
                                ? 'Grand Master'
                                : member.real_title === 8
                                  ? 'Challenger'
                                  : member.real_title === 9
                                    ? 'Şampiyon'
                                    : member.real_title === 10
                                      ? 'Yıldız'
                                      : member.real_title === 11
                                        ? 'Galaksi'
                                        : member.real_title === 12
                                          ? 'Evren'
                                          : 'Üye değil'
                  : 'Üye değil'

                }
              </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-center">
                <DataStatsCard
                    color="primary"
                    title="Toplam Kazanç"
                    subtitle="Bu ay.."
                    uses={`${member.unconfirmed_balance}TL`}
                    increment={incremnetBetweenTwoNumbers(
                      member.confirmed_balance,
                      member.unconfirmed_balance,
                    )}
                    icon={
                        <svg
                            width={26}
                            height={26}
                            viewBox="0 0 26 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M22.75 17.3324V8.66575C22.7496 8.28579 22.6493 7.91262 22.4592 7.58367C22.269 7.25472 21.9957 6.98156 21.6667 6.79158L14.0833 2.45825C13.754 2.26808 13.3803 2.16797 13 2.16797C12.6197 2.16797 12.246 2.26808 11.9167 2.45825L4.33333 6.79158C4.00428 6.98156 3.73098 7.25472 3.54083 7.58367C3.35069 7.91262 3.25039 8.28579 3.25 8.66575V17.3324C3.25039 17.7124 3.35069 18.0855 3.54083 18.4145C3.73098 18.7434 4.00428 19.0166 4.33333 19.2066L11.9167 23.5399C12.246 23.7301 12.6197 23.8302 13 23.8302C13.3803 23.8302 13.754 23.7301 14.0833 23.5399L21.6667 19.2066C21.9957 19.0166 22.269 18.7434 22.4592 18.4145C22.6493 18.0855 22.7496 17.7124 22.75 17.3324Z"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M3.54248 7.53906L13 13.0099L22.4575 7.53906"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M13 23.92V13"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    }
                />
                <DataStatsCard
                    color="primary"
                    title="Getirdiği İnsanlar"
                    subtitle="Bu ay.."
                    uses={member.registered_user}
                    increment={incremnetBetweenTwoNumbers(
                      0, member.registered_user,
                    )}
                    icon={
                        <svg
                            width={26}
                            height={26}
                            viewBox="0 0 26 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_2953_1034)">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M1.46869 16.6353C2.51577 15.5882 3.93591 15 5.41671 15H14.0834C15.5642 15 16.9843 15.5882 18.0314 16.6353C19.0785 17.6824 19.6667 19.1025 19.6667 20.5833V22.75C19.6667 23.4404 19.1071 24 18.4167 24C17.7264 24 17.1667 23.4404 17.1667 22.75V20.5833C17.1667 19.7656 16.8419 18.9813 16.2636 18.4031C15.6854 17.8249 14.9011 17.5 14.0834 17.5H5.41671C4.59896 17.5 3.8147 17.8249 3.23646 18.4031C2.65822 18.9813 2.33337 19.7656 2.33337 20.5833V22.75C2.33337 23.4404 1.77373 24 1.08337 24C0.393018 24 -0.166626 23.4404 -0.166626 22.75V20.5833C-0.166626 19.1025 0.421617 17.6824 1.46869 16.6353Z"
                                    fill="currentColor"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M9.74996 4.5C8.04708 4.5 6.66663 5.88046 6.66663 7.58333C6.66663 9.28621 8.04708 10.6667 9.74996 10.6667C11.4528 10.6667 12.8333 9.28621 12.8333 7.58333C12.8333 5.88046 11.4528 4.5 9.74996 4.5ZM4.16663 7.58333C4.16663 4.49974 6.66637 2 9.74996 2C12.8335 2 15.3333 4.49974 15.3333 7.58333C15.3333 10.6669 12.8335 13.1667 9.74996 13.1667C6.66637 13.1667 4.16663 10.6669 4.16663 7.58333Z"
                                    fill="currentColor"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M20.4564 16.0784C20.629 15.41 21.3107 15.008 21.9792 15.1806C23.177 15.4899 24.2382 16.1882 24.9961 17.1659C25.754 18.1437 26.1658 19.3454 26.1667 20.5825V22.7501C26.1667 23.4404 25.607 24.0001 24.9167 24.0001C24.2263 24.0001 23.6667 23.4404 23.6667 22.7501V20.5838C23.666 19.9008 23.4387 19.2374 23.0202 18.6976C22.6017 18.1577 22.0157 17.772 21.3542 17.6012C20.6858 17.4286 20.2838 16.7469 20.4564 16.0784Z"
                                    fill="currentColor"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M16.1224 3.08088C16.2936 2.41209 16.9746 2.00875 17.6434 2.17999C18.8444 2.48749 19.9088 3.18597 20.669 4.1653C21.4292 5.14463 21.8418 6.3491 21.8418 7.58884C21.8418 8.82858 21.4292 10.0331 20.669 11.0124C19.9088 11.9917 18.8444 12.6902 17.6434 12.9977C16.9746 13.1689 16.2936 12.7656 16.1224 12.0968C15.9511 11.428 16.3545 10.7471 17.0233 10.5758C17.6865 10.406 18.2744 10.0203 18.6941 9.47946C19.1139 8.93863 19.3418 8.27347 19.3418 7.58884C19.3418 6.90421 19.1139 6.23905 18.6941 5.69823C18.2744 5.1574 17.6865 4.77168 17.0233 4.60186C16.3545 4.43063 15.9511 3.74966 16.1224 3.08088Z"
                                    fill="currentColor"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_2953_1034">
                                    <rect width={26} height={26} fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    }
                />
                <DataStatsCard
                    color="primary"
                    title="Toplam Puan"
                    subtitle="Bu ay.."
                    uses={member.real_point1}
                    increment={incremnetBetweenTwoNumbers(
                      member.last_months_real_point1,
                      member.real_point1,
                    )}
                    icon={
                        <div
                            width={26}
                            height={26}
                            className="w-8 h-8 rounded-full bg-yellow-300"
                        ></div>
                    }
                />
            </div>
        </dialog>
  )
}

function DataStatsCard({
  icon,
  color,
  title,
  subtitle,
  uses,
  increment,
}) {
  return (
        <div className="w-full px-4 sm:w-1/2 lg:w-1/4">
            <div className="mb-8 rounded bg-white p-5 shadow-card lg:p-4 xl:p-5">
                <div className="mb-5 flex items-center">
                    <div
                        className={`mr-[14px] flex h-[50px] w-[50px] items-center justify-center bg-${color} bg-opacity-[8%] text-${color}`}
                    >
                        {icon}
                    </div>
                    <div>
                        <h5 className="text-base font-medium text-black lg:text-sm xl:text-base">
                            {title}
                        </h5>
                        <p className="text-sm text-body-color">{subtitle}</p>
                    </div>
                </div>
                <div>
                    <div className="mb-5 flex items-end">
                        <p className="mr-1 text-2xl font-bold leading-none text-black">
                            {uses}
                        </p>
                        <p
                            className={`inline-flex items-center text-sm font-medium ${increment > 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                            {increment}
                            <span className="pl-1">
                {increment > 0 && (
                    <svg
                        width="10"
                        height="11"
                        viewBox="0 0 10 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M4.35716 2.8925L0.908974 6.245L5.0443e-07 5.36125L5 0.499999L10 5.36125L9.09103 6.245L5.64284 2.8925L5.64284 10.5L4.35716 10.5L4.35716 2.8925Z"
                            fill="currentColor"
                        />
                    </svg>
                )}
                                {increment < 0 && (
                                    <svg
                                        width="10"
                                        height="11"
                                        viewBox="0 0 10 11"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M5.64284 8.1075L9.09102 4.755L10 5.63875L5 10.5L-8.98488e-07 5.63875L0.908973 4.755L4.35716 8.1075L4.35716 0.500001L5.64284 0.500001L5.64284 8.1075Z"
                                            fill="currentColor"
                                        ></path>
                                    </svg>
                                )}
              </span>
                        </p>
                    </div>

                </div>
            </div>
            <span className="hidden w-[75%] bg-[#9b51e0]"></span>
        </div>
  )
}

function TableHead({ headers, setOrder, setOrderBy }) {
  return (
        <div className="bg-[#F9FAFB] text-left flex w-full">
            {headers.map((header, index) => (

                <div
                    className={`py-4 px-4 relative text-base font-medium uppercase text-dark flex w-1/4 last:hidden ${header.styles}`}
                    key={index}
                >
                    {header.name}
                    <div className="w-8 h-8 border flex flex-col">
                        <span onClick={() => {
                          setOrder(() => {
                            setOrderBy('asc')
                            return header.name
                          })
                        }}>
                            Up
                        </span>
                        <span onClick={() => {
                          setOrder(() => {
                            setOrderBy('desc')
                            return header.name
                          })
                        }}>
                            Down
                        </span>

                    </div>
                </div>

            ))}
        </div>
  )
}

function TableBody({ data, setMember,loading }) {
  if(loading)return <div className='w-full flex justify-center items-center text-xl text-center'>Yükleniyor</div>
  if(Object.keys(data)<= 0 ) return <div className='w-full flex justify-center items-center text-xl text-center'>Veri Yok</div>
  return (
        <FixedSizeList
        width="100%"
        height={800}
        itemSize={100}
        itemCount={Object.keys(data).length}
        itemData={{data,setMember}}
        className='w-full h-full'
        >
        {RenderData}
        </FixedSizeList>
  )
  
}

const RenderData = ({data,index,style})=>{
  const row = Object.keys(data.data)[index]
  return  <div key={index} style={{...{display:"flex" , justifyContent:"center", alignItems:"center",width:"100%"},...style}}>
  <td className="w-1/4">
          <div className="flex items-center">
              <img
                  src={data.data[row].profilepicture}
                  alt="image"
                  className="h-45 mr-4 w-11 rounded-full"
              />
              <div>
                  <h5 className="text-dark text-sm font-medium">{data.data[row].name}</h5>
                  <p className="text-body-color text-sm">{data.data[row].email}</p>
                  <p className="text-body-color text-sm">{data.data[row].phone}</p>
              </div>
          </div>
      </td>
      <td className="w-1/5">
          <p className="text-body-color">{data.data[row].userType === 0 ? 'Müsteri' : 'Üye'}</p>
      </td>
      <td className=" text-center w-1/5">
          {data.data[row].active
            ? (
              <span
                  className="inline-flex items-center justify-center rounded-full bg-[#34D399] bg-opacity-[15%] py-2 px-4 text-xs font-semibold text-[#34D399]">
      Aktif
    </span>
              )
            : (
              <span
                  className="inline-flex items-center justify-center rounded-full bg-red-600 bg-opacity-[15%] py-2 px-4 text-xs font-semibold text-red-600">
      Deaktif
    </span>
              )}
      </td>
      <td className="text-center w-1/5">
          {data.data[row].userType !== 1
            ? (
              <p className="text-body-color text-sm">Üye Değil</p>
              )
            : (
              <>
                  <p className="text-body-color text-sm">
                      <span className="font-semibold mr-2">Getirdiği Üye: </span>
                      {data.data[row].registered_user}
                  </p>
                  <p className="text-body-color text-sm">
                      <span className="font-semibold mr-2">Kariyer: </span>
                      {data.data[row].real_title}
                  </p>
              </>
              )}
      </td>
      <td className=" text-center">
          <button onClick={() => data.setMember(data.data[row])}
                  className="text-primary border-primary hover:bg-primary inline-block rounded-full border py-2 px-5 text-sm font-medium hover:text-white">
              İncele
          </button>
      </td>
  </div>

}