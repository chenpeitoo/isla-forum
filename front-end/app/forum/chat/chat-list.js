'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { method } from 'lodash'
import { useAuth } from '../../../hook/use-auth'
import ComponentsAddChat from './_components/add-chat'
import ComponentsAvatar from '../_components/avatar'
import { BeatLoader } from 'react-spinners'
import GetChatList from './_method/getChatList'

// /* TODO 換成幾小時 */

export default function ChatList({ setListMutate }) {
  const { user, isAuth } = useAuth()
  const userID = user.id
  // const url = `http://localhost:3005/api/forum/chat?userID=${userID}` //QU 在這邊放userID好嗎？
  // const { data, isLoading, error, mutate } = useSWR(url, fetcher)

  // const rooms = data?.roomList?.map((room) => ({
  //   ...room,
  //   msg: JSON.parse(room.msg),
  // }))
  // const roomHeader = data?.roomHeader
  // const { mutate } = GetChatList(userID)
  const { data, isLoading, error, mutate } = GetChatList(userID)
  const rooms = data?.roomList?.map((room) => ({
    ...room,
    msg: JSON.parse(room.msg),
  }))
  const roomHeader = data?.roomHeader

  return (
    <>
      <div className="chat-list-items">
        {error ? (
          <div className="d-flex align-items-center justify-content-center h-100">
            連線失敗，請再試一次
          </div>
        ) : isLoading ? (
          <div className="d-flex align-items-center justify-content-center h-100">
            {/* <BeatLoader color="#fd7061" /> */}
          </div>
        ) : (
          rooms &&
          rooms.map((room, i) => {
            const date = new Date(room.msg.created_at)
            const dateFormat = `${date.getMonth()}月${date.getDate()}日`
            return (
              <Link
                href={`/forum/chat/${room.room_id}`}
                className="chat-list-item d-flex gap-2 p-3 rounded-3 main-text-color"
                key={i}
              >
                {roomHeader
                  .filter((v) => v.room_id === room.room_id)[0]
                  .imgs?.split(',')
                  .slice(0, 2)
                  .map((ava, i) => {
                    return (
                      <div className={`chat-list-avas-${i}`} key={i}>
                        <ComponentsAvatar
                          src={ava}
                          alt={'成員'}
                          classWidth="36"
                        />
                      </div>
                    )
                  })}
                {/* <div className="card-border rounded-circle">
                  <ComponentsAvatar
                    src={room.msg.ava_url}
                    alt=""
                    classWidth="44"
                  />
                </div> */}
                <div className="friend-info d-flex flex-column gap-1 w-100">
                  <div className="friend-name-date d-flex justify-content-between gap-2">
                    {/* <div className="name text-nowrap text-truncate fs16 fw-medium">
                      {room.msg.nick}
                    </div> */}
                    <div className="text-truncate">
                      {
                        roomHeader.filter((v) => v.room_id === room.room_id)[0]
                          .nicks
                      }
                    </div>
                    <div className="date text-nowrap sub-text-color fs14 fw-normal">
                      {dateFormat}
                    </div>
                  </div>
                  <div className="cotent-preview text-truncate sub-text-color fs14 fw-normal">
                    <span className="fw-medium">{room.msg.nick}：</span>
                    <span className="fw-light">{room.msg.content}</span>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </>
  )
}
