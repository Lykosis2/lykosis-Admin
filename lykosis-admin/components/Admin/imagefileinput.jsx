import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react';

export default function ImageFileInput({ label, id, resolution, uploadTo, triggerUpload, onlyOnTrigger, setTriggerUpload }) {
  const session = useSession()
  console.log(session);
  let uploadToSrc = ''
  switch (uploadTo) {
    case 'product':
      uploadToSrc = 'products'
      break
    case 'productPdf':
      uploadToSrc = 'productPdf'
      break
    case 'category':
      uploadToSrc = 'categories'
      break
    case 'photos':
      uploadToSrc = 'photos'
      break
  }
  // resolution = [width, height] || undefined

  const [files, setFiles] = useState([])
  const [images, setImages] = useState([])
  const [actualImages, setActualImages] = useState([])
  console.log('images', setTriggerUpload)

  useEffect(() => {
    if (triggerUpload && actualImages.length > 0) {
      upload(actualImages[0])
      setTriggerUpload?.(false)
    }
  }, [triggerUpload, actualImages])

  function uploadToCategory(file) {
    const formData = new FormData()
    formData.append('file', file)
    console.log(session.data.user);
    console.log(session);
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/admin/category/image?id=${id}`, {
      method: 'PUT',
      body: formData,
        headers:{
            "userId":session.data.user.dataValues.id,
            "randomStr":session.data.user.sessionToken
        }
    }).then((res) => {
      if(res.status === 401){
        signOut().then(() => {
          window.location.href = "/admin/login"
        })
      }
    })
  }

  function uploadToPhotos(file) {
    const formData = new FormData()
    console.log(file,"file");
    formData.append('file', file)
    console.log("hello");
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/photos/${id}`, {
      method: 'PUT',
      body: formData,
      headers:{
            "userId":session.data.user.dataValues.id,
            "randomStr":session.data.user.sessionToken
      }
    }).then((res) => {
      if(res.status === 401){
        signOut().then(() => {
          window.location.href = "/admin/login"
        })
      }
    })
  }

  function uploadToProduct(file) {
    const formData = new FormData()
    formData.append('file', file)

    fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/admin/products/upload-image/route?id=${id}`, {
      method: 'PUT',
      body: formData,
      headers:{
            "userId":session.data.user.dataValues.id,
            "randomStr":session.data.user.sessionToken
      }
    }).then((res) => {
      if(res.status === 401){
        signOut().then(() => {
          window.location.href = "/admin/login"
        })
      }
    })
  }

  function uploadToProductPdf(file) {
    const formData = new FormData()
    formData.append('file', file)

    fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/admin/products/upload-pdf?id=${id}`, {
      method: 'PUT',
      body: formData,
      headers:{
            "userId":session.data.user.dataValues.id,
            "randomStr":session.data.user.sessionToken
      }
    }).then((res) => {
      if(res.status === 401){
        signOut().then(() => {
          window.location.href = "/admin/login"
        })
      }
    })
  }

  function upload(file) {
    switch (uploadTo) {
      case 'product':
        uploadToProduct(file)
        break
      case 'productPdf':
        uploadToProductPdf(file)
        break
      case 'category':
        uploadToCategory(file)
        break
      case 'photos':
        uploadToPhotos(file)
        break
      default:
        alert('Hata.') // ???
        console.error('uploadTo is not defined.')
        break
    }
  }

  function handleOnChange(e) {
    const inputFiles = e.target.files
    if (inputFiles.length !== 1)
      alert('Lütfen tek bir resim yükleyiniz.')

    for (let i = 0; i < inputFiles.length; i++) {
      // if file size is greater than 3MB
      if (inputFiles[i].size > 3 * 1024 * 1024) {
        alert('Lütfen 3MB\'dan küçük resim yükleyiniz.')
        return
      }

      // // if file resolution is greater the resolution
      // if (resolution) {
      //   const img = new Image()
      //   img.src = URL.createObjectURL(inputFiles[i])
      //   img.onload = () => {
      //     if (img.width > resolution[0] || img.height > resolution[1])
      //       throwError(`Lütfen ${resolution[0]}x${resolution[1]} boyutundan küçük resim yükleyiniz.`)
      //   }
      // }

      // if file type is not image
      setFiles(inputFiles)
      if (uploadToSrc !== 'productPdf' && !inputFiles[i].type.includes('image')) {
        alert('Lütfen resim dosyası yükleyiniz.')
        return
      }

      if (!onlyOnTrigger) {
        const file = inputFiles[i]
        upload(file)
      }
    }
  }

  useEffect(() => {
    console.log(files)
  }, [files])

  useEffect(() => {
    const images = []
    for (let i = 0; i < files.length; i++) {
      const image = URL.createObjectURL(files[i]) ////////////////////////////////
      images.push(image)
      actualImages.push(files[i])
    }
    setImages(images)
  }, [files])

  return (
        <div className="flex flex-col gap-2">
            <label className='mb-3 block text-base font-medium text-black'>
                {label} <br/>
                Çözünürlük: {resolution ? `${resolution[0]}x${resolution[1]}` : 'Sınırsız'}
            </label>
            {images.length === 0
              ? (
                <div className='relative'>
                    <label
                        htmlFor={`file-${uploadToSrc === 'productPdf' ? 'pdf-' : ''}${id}`}
                        className='flex min-h-[175px] w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-primary p-6'
                    >
                        <div>
                            {uploadToSrc === 'productPdf' ? (
                            <input onChange={handleOnChange} type='file' name={`file-pdf-${id}`} id={`file-pdf-${id}`}
                                   accept=".pdf" className='sr-only'/>
                            ) : (
                            <input onChange={handleOnChange} type='file' name={`file-${id}`} id={`file-${id}`}
                                   accept=".jpg,.jpeg,.png,.webp" className='sr-only'/>
                            )}
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
            <Image src={`${process.env.NEXT_PUBLIC_CDN_URL}/${uploadToSrc}/${id}`} width={250} height={200} className="w-[250px] h-[200px] object-contain"
            onError={(event) => {
              event.target.srcset = '/fallback.png'
            }}
            />
              </div>
                    </label>
                </div>
                )
              : (
                <>
                    {
                        images.map((image, index) => (
                            <Image key={index} src={image} width={250} height={200}
                                   className="w-[250px] h-[200px] object-contain"
                                   alt={files[index].name}/>
                        ))
                    }
                </>
                )}
        </div>
  )
}
