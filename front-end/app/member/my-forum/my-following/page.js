'use client'

import useSWR from 'swr'
import '@/app/forum/_components/forum.css'
import Link from 'next/link'
import FollowingCard from './following-card'
import { useAuth } from '../../../../hook/use-auth'
import useFollow from '../../../forum/_hooks/useFollow'
import { useEffect } from 'react'
import ConfirmModal from '../../../forum/_components/confirmModal'

const fetcher = ([url, body]) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then((res) => res.json())

export default function MyFollowingPage() {
  const userID = useAuth().user.id
  // const { data, isLoading, error, mutate } = useSWR(
  //   [`http://localhost:3005/api/forum/follow/get-follow-list`, { userID }],
  //   fetcher
  // )
  // const followings = data?.data

  const { follows, isFollow, handleFollow, isLoading, error, mutate } =
    useFollow(userID, '')

  // useEffect(() => {
  //   mutate()
  // }, [follows])

  return (
    <>
      <div className="body">
        <div className="my-following d-flex flex-column gap-3 w-100 rounded-3 px-4 py-3">
          <div className="my-following-header d-flex align-items-center justify-content-between flex-wrap">
            <div className="fs32 fw-bold text-nowrap">我的追蹤</div>
            <Link
              className="text-main px-3 py-2 rounded-pill bg-hovering-gray"
              href={'/forum'}
            >
              <i className="bi bi-box-arrow-left me-2"></i>
              回到論壇
            </Link>
          </div>
          <div className="my-following-main row flex-wrap">
            {error
              ? '連線失敗，請稍後再試'
              : isLoading
                ? '載入中'
                : follows.map((f, i) => {
                    return (
                      <div key={i} className="col col-6 col-lg-6 pb-3">
                        <FollowingCard
                          followID={f.follow_id}
                          nick={f.follow_nick}
                          cardHref={`/forum/profile/${f.follow_id}`}
                          imgSrc={f.follow_img}
                          imgClassWidth="50"
                          followMutate={mutate}
                        />
                      </div>
                    )
                  })}
          </div>
        </div>
      </div>
    </>
  )
}
