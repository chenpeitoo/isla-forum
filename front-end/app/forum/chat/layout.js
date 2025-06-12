'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../hook/use-auth'
import './_components/chat.css'
import ChatList from './chat-list'
import ComponentsAddChat from './_components/add-chat'
import { useParams } from 'next/navigation'
import EditPostModal from '../_components/edit-post-modal'

export default function ChatLayout({ children }) {
  const router = useRouter()
  const userID = useAuth().user.id
  // useEffect(() => {
  //   if (userID === 0) {
  //     confirm('請先登入')
  //     router.push('/member/login')
  //   }
  // }, [userID, router])

  const [listMutate, setListMutate] = useState(() => {})

  console.log(useParams().roomID)
  const isInRoom = !!useParams().roomID
  return (
    <>
      <main className="main col col-10 col-xl-10 d-flex flex-column align-items-center mx-0 px-0 h-100">
        <div className="chat-container row w-100 h-100">
          <div
            className={`chat-list col col-12 col-md-5 bg-pure-white rounded-3 p-0 shadow-forum overflow-hidden position-relative main-text-color bg-pure-white ${isInRoom ? 'd-none d-md-block' : 'd-block'}`}
          >
            <div className="chat-list-header d-flex px-3 py-2 fs24 fw-medium position-absolute bg-pure-white rounded-top-3 shadow-sm z-1">
              <span className="me-auto">我的訊息</span>
              <button
                className="p-0 button-clear"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#addChat"
              >
                <i className="bi bi-pencil-square"></i>
              </button>
            </div>
            <div className="chat-list-items-block position-absolute overflow-auto px-2 py-2">
              {userID !== 0 && <ChatList setListMutate={setListMutate} />}
            </div>
          </div>
          <div
            className={`chat-room col col-md-7 p-0 pe-3 ${isInRoom ? 'd-block' : 'd-none d-md-block'} d-md-block overflow-auto`}
          >
            {children}
          </div>
        </div>
      </main>
      <ComponentsAddChat listMutate={listMutate} />
      {/* <EditPostModal isUpdated={false} mutate={() => {}} /> */}
      {/* FIXME 這裡的modal要怎麼mutate??? */}
    </>
  )
}
