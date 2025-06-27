'use client'

import Link from 'next/link'
import ComponentsAvatar from '@/app/forum/_components/avatar'
import ComponentsButtonFollowing from '../../../forum/_components/btn-follow'
import ComponentsButtonChat from '../../../forum/_components/btn-chat'

export default function FollowingCard({
  nick = '',
  cardHref = '',
  imgSrc = '',
  imgClassWidth = '',
  followMutate,
}) {
  return (
    <>
      <Link
        href={cardHref}
        className="following-card d-flex flex-column flex-xl-row  align-items-center justify-content-center px-3 py-3 gap-3 rounded-3 card-border bg-pure-white forum-shadow"
      >
        <div className="following-info  d-flex gap-2 align-items-center main-text-color">
          <ComponentsAvatar
            src={imgSrc}
            alt={nick}
            classWidth={imgClassWidth}
          />
          <div className="d-flex flex-column">
            <span className="fs20 fw-bold ">{nick}</span>
          </div>
        </div>
        <div className="following-statis  d-flex justify-content-center gap-3  text-center"></div>
        <div className="following-button d-flex gap-2 m-0 ms-xl-auto">
          <ComponentsButtonFollowing
            isFollow={true}
            followMutate={followMutate}
          />
          <ComponentsButtonChat />
        </div>
      </Link>
    </>
  )
}
