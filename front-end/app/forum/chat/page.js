'use client'

import Ripples from 'react-ripples'
import { useAuth } from '../../../hook/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ChatPage(props) {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <>
      <div className="chat-main d-flex flex-column justify-content-center align-items-center gap-1 h-100 bg-pure-white rounded-3 ms-3 shadow-forum">
        <div>
          <i className="bi bi-chat-dots fs56"></i>
        </div>
        <div className="fs24 fw-bolder">你的訊息</div>
        <div className="sub-text-color">和朋友或群組討論最新美妝話題！</div>
        <Ripples className="bounce bg-main px-3 py-1 mt-2 rounded-3">
          <button
            className="button-clear text-white"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#addChat"
          >
            發送訊息
          </button>
        </Ripples>
      </div>
    </>
  )
}
