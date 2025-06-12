'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
// ==== css ====
import './_style/img-container.css'

export default function ImgContainer(props) {
  const [imgClass, setImgClass] = useState(['register-img-1', 'register-img-2'])
  useEffect(() => {
    let n = 0
    setInterval(() => {
      if (n % 2 === 1) {
        setImgClass(['register-img-1', 'register-img-2'])
      } else {
        setImgClass(['register-img-2', 'register-img-1'])
      }
      n++
      // console.log(n)
    }, 2000)
  }, [])
  return (
    <>
      <div className="position-relative register-img-container">
        <Image
          src={'http://localhost:3000/images/register/banner1.jpg'}
          alt="banner1"
          width={100}
          height={100}
          className={imgClass[0]}
        />
        <Image
          src={'http://localhost:3000/images/register/banner2.jpg'}
          alt="banner1"
          width={100}
          height={100}
          className={imgClass[1]}
        />
      </div>
    </>
  )
}
