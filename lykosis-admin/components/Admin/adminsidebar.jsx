import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import ChevronDoubleLeftIcon from '../icons/ChevronDoubleLeftIcon'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const session = useSession()
  console.log(session);
  console.log();

  return (
        <>
            <button onClick={() => setIsOpen(!isOpen)} className={`absolute flex items-center justify-center top-[50%] bg-white p-2 rounded-full drop-shadow-lg z-10 transition-all duration-300 ${isOpen ? 'left-[280px]' : 'left-5 rotate-180'}`}>
                <ChevronDoubleLeftIcon className="w-6 h-6"/>
            </button>
            <section className={`h-screen bg-white relative transition-all origin-left duration-300 ${isOpen ? 'scale-100' : 'scale-0 w-0'}`}>
                <div className="flex h-screen w-[300px] flex-col justify-between bg-[#212B36]">
                    <div className="overflow-y-auto tree-container">
                        <div className="p-10 pb-9">
                            <a href="/home" className="block">
                                <Image src="/logo.png" width={300} height={80} alt="logo"/>
                            </a>
                        </div>

                        <div className="mb-[30px]">
                            <nav className="px-[25px]">
                                <div className='flex flex-col gap-2 '>
                                <p className=" px-[15px] text-sm font-semibold uppercase text-white">
                                    Sayfalar
                                </p>   
                                <Link href="/admin/dashboard" className='flex text-lg text-white items-center gap-2'>
                                <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
                                                />
                                </svg>
                                Dashboard
                                </Link>                                 
                                <Link href={"/admin/members"}  className='flex text-lg text-white items-center gap-2'>
                                <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                                />
                                            </svg>
                                Üyeler 
                                </Link>
                                <Link href={"/admin/products"} className='flex text-lg text-white items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                                            </svg>
                                Ürünler
                                </Link>
                                <Link href={"/admin/orders"} className='flex text-lg text-white items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
                                            </svg>
                                Siparişler
                                </Link>
                                <Link href={"/admin/returns"} className='flex text-lg text-white items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75h4.875a2.625 2.625 0 010 5.25H12M8.25 9.75L10.5 7.5M8.25 9.75L10.5 12m9-7.243V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
                                            </svg>
                                İadeler
                                </Link>
                                    
                                <Link href={"/admin/category"} className='flex text-lg text-white items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                            </svg>
                                Kategoriler
                                </Link>
                                <Link href={"/admin/images"} className='flex text-lg text-white items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                            </svg>
                                Fotoğraflar
                                </Link>

                                <p className="mt-3 px-[15px] text-sm font-semibold uppercase text-white">
                                    Ödenecekler 
                                </p>   
                                <Link href={"/admin/payments/shareholder"} className='flex text-lg text-white items-center gap-2'>
                                    Hissedar Bonusu
                                </Link>
                                <Link href={"/admin/payments/career"} className='flex text-lg text-white items-center gap-2'>
                                    Kariyer Bonusu
                                </Link>
                                <Link href={"/admin/payments/leadership"} className='flex text-lg text-white items-center gap-2'>
                                    Liderlik Bonusu
                                </Link>
                                <Link href={"/admin/payments/other"} className='flex text-lg text-white items-center gap-2'>
                                    Diğer Paralar
                                </Link>
                                <p className="mt-3 px-[15px] text-sm font-semibold uppercase text-white">
                                    Diğerleri
                                </p>   
                                <Link href={"/admin/calender"} className='flex text-lg text-white items-center gap-2'>
                                    Buluşma ekle
                                </Link>
                                <Link href={"/admin/tatilcsv"} className='flex text-lg text-white items-center gap-2'>
                                    Tatil csv
                                </Link>
                                <Link href={"/admin/deleteUser"} className='flex text-lg text-white items-center gap-2'>
                                    Üye Silme
                                </Link>
                                <Link href={"/admin/changeUser"} className='flex text-lg text-white items-center gap-2'>
                                    Üye Düzenle
                                </Link>
                                <Link href={"/admin/changeTc"} className='flex text-lg text-white items-center gap-2'>
                                    TC Düzenle
                                </Link>
                                <Link href={"/admin/createAdmin"} className='flex text-lg text-white items-center gap-2'>
                                    Admin Ekleme
                                </Link>
                                <Link href={"/admin/showAdmin"} className='flex text-lg text-white items-center gap-2'>
                                    Adminleri göster
                                </Link>
                                <Link href={"/admin/changeAdmin"} className='flex text-lg text-white items-center gap-2'>
                                    Adminleri düzenle
                                </Link>
                                <Link href={"/admin/importantPanic"} className='flex text-lg text-white items-center gap-2'>
                                    Panic kısmı
                                </Link>

                                <Link href={"/admin"} className='flex text-lg text-white items-center '>
                                <svg
                                                width={18}
                                                height={18}
                                                viewBox="0 0 18 18"
                                                className="fill-current"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M3.75 3C3.55109 3 3.36032 3.07902 3.21967 3.21967C3.07902 3.36032 3 3.55109 3 3.75V14.25C3 14.4489 3.07902 14.6397 3.21967 14.7803C3.36032 14.921 3.55109 15 3.75 15H6.75C7.16421 15 7.5 15.3358 7.5 15.75C7.5 16.1642 7.16421 16.5 6.75 16.5H3.75C3.15326 16.5 2.58097 16.2629 2.15901 15.841C1.73705 15.419 1.5 14.8467 1.5 14.25V3.75C1.5 3.15326 1.73705 2.58097 2.15901 2.15901C2.58097 1.73705 3.15326 1.5 3.75 1.5H6.75C7.16421 1.5 7.5 1.83579 7.5 2.25C7.5 2.66421 7.16421 3 6.75 3H3.75Z"
                                                />
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M11.4697 4.71967C11.7626 4.42678 12.2374 4.42678 12.5303 4.71967L16.2803 8.46967C16.5732 8.76256 16.5732 9.23744 16.2803 9.53033L12.5303 13.2803C12.2374 13.5732 11.7626 13.5732 11.4697 13.2803C11.1768 12.9874 11.1768 12.5126 11.4697 12.2197L14.6893 9L11.4697 5.78033C11.1768 5.48744 11.1768 5.01256 11.4697 4.71967Z"
                                                />
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M6 9C6 8.58579 6.33579 8.25 6.75 8.25H15.75C16.1642 8.25 16.5 8.58579 16.5 9C16.5 9.41421 16.1642 9.75 15.75 9.75H6.75C6.33579 9.75 6 9.41421 6 9Z"
                                                />
                                </svg>
                                Çıkış Yap
                                </Link>
                                

                                   
                                </div>
                            </nav>
                        </div>
                    </div>

                    <div className="border-t border-[#E7E7E733] p-[30px] pb-10">
                        <div className="flex items-center">
                            <div className="mr-4 h-12 w-full max-w-[48px] overflow-hidden rounded-full">
                                <img
                                    src="https://cdn.tailgrids.com/2.0/image/assets/images/avatar/image-05.jpg"
                                    alt="profile"
                                    className="h-full w-full rounded-full object-cover object-center"
                                />
                            </div>
                            <div>
                                <h6 className="text-base font-medium text-white text-opacity-80">
                                    Musharof
                                </h6>
                                <p className="text-sm text-white text-opacity-50">
                                    hello@tailgrids.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
  )
}