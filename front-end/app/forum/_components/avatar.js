'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function ComponentsAvatar({
  src = 'http://localhost:3005/images/member/default-avatar.jpg',
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
          src={`http://localhost:3005/images/member/${src}`}
          alt={alt}
          fill={true}
        />
      </div>
    </>
  )
}
