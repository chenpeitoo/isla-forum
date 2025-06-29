'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function ComponentsAvatar({
  src = '${process.env.NEXT_PUBLIC_API_URL}/images/member/default-avatar.jpg',
  alt = '123',
  classWidth = '',
}) {
  return (
    <>
      <div
        className="position-relative rounded-circle card-border"
        style={{ width: classWidth + 'px', height: classWidth + 'px' }}
      >
        <Image
          className="rounded-circle object-fit-cover w-100"
          src={`${process.env.NEXT_PUBLIC_API_URL}/images/member/${src}`}
          alt={alt}
          fill={true}
        />
      </div>
    </>
  )
}
