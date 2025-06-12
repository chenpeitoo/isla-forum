'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import useSWR from 'swr'

export default function FollowingCard({
  cardHref = '',
  imgSrc = '',
  imgAlt = '',
  imgClassWidth = '',
  nick = '',
}) {
  return (
    <>
      <Link
        href={cardHref}
        className="following-card w-auto d-flex flex-column flex-lg-row flex-grow-1 align-items-center px-3 py-3  gap-3 rounded-3 card-border bg-pure-white forum-shadow"
      >
        {/* <div className="row"> */}
        <div className="following-info  d-flex gap-2 align-items-center main-text-color">
          <ComponentsAvatar
            src={imgSrc}
            alt={imgAlt}
            classWidth={imgClassWidth}
          />
          <div className="d-flex flex-column">
            <span className="fs20 fw-bold ">{nick}</span>
            {/* <span className="fs14 sub-text-color fw-light">
              ciaoMing@gmail.com
            </span> */}
          </div>
        </div>
        <div className="following-statis  d-flex justify-content-center gap-3 w-100 text-center">
          <div className="follower d-flex gap-2 align-items-center">
            <div className="main-color fs20">430</div>
            <div className="main-text-color fs14 text-nowrap">粉絲</div>
          </div>
          <div className="article d-flex gap-2 align-items-center">
            <div className="main-color fs20">15</div>
            <div className="main-text-color fs14 text-nowrap">文章</div>
          </div>
        </div>
        <div className="following-button  d-flex gap-2">
          <button className="button-triggerable active px-3 py-1 color-isla-white rounded-3 text-nowrap fw-medium">
            已追蹤
          </button>
          <button className="button-triggerable default px-3 py-1 color-isla-white rounded-3 text-nowrap fw-medium">
            聊天
          </button>
        </div>
        {/* </div> */}
      </Link>
    </>
  )
}
