'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import ComponentsAvatar from '@/app/forum/_components/avatar'
import useSWR from 'swr'
import ComponentsButtonFollowing from '../../../forum/_components/btn-follow'
import ComponentsButtonChat from '../../../forum/_components/btn-chat'
import { useRouter } from 'next/navigation'

export default function FollowingCard({
  followID = '',
  nick = '',
  cardHref = '',
  imgSrc = '',
  imgClassWidth = '',
  followMutate,
}) {
  const router = useRouter()
  return (
    <>
      <Link
        href={cardHref}
        className="following-card d-flex flex-column flex-xl-row  align-items-center justify-content-center px-3 py-3 gap-3 rounded-3 card-border bg-pure-white forum-shadow"
      >
        {/* <div className="row"> */}
        <div className="following-info  d-flex gap-2 align-items-center main-text-color">
          <ComponentsAvatar
            src={imgSrc}
            alt={nick}
            classWidth={imgClassWidth}
          />
          <div className="d-flex flex-column">
            <span className="fs20 fw-bold ">{nick}</span>
            {/* <span className="fs14 sub-text-color fw-light">
              ciaoMing@gmail.com
            </span> */}
          </div>
        </div>
        <div className="following-statis  d-flex justify-content-center gap-3  text-center">
          {/* <div className="follower d-flex gap-2 align-items-center">
            <div className="main-color fs20">430</div>
            <div className="main-text-color fs14 text-nowrap">粉絲</div>
          </div>
          <div className="article d-flex gap-2 align-items-center">
            <div className="main-color fs20">15</div>
            <div className="main-text-color fs14 text-nowrap">文章</div>
          </div> */}
        </div>
        <div className="following-button d-flex gap-2 m-0 ms-xl-auto">
          <ComponentsButtonFollowing
            isFollow={true}
            followMutate={followMutate}
          />
          <ComponentsButtonChat />
        </div>
        {/* </div> */}
      </Link>
    </>
  )
}
