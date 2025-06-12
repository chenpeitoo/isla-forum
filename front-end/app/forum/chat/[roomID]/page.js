'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../../../hook/use-auth'
import ReconnectingWebSocket from 'reconnecting-websocket'
import useSWR from 'swr'
import ComponentsAvatar from '../../_components/avatar'
import UseImg from '../../_hooks/useImg'
import { BeatLoader } from 'react-spinners'
import ConfirmModal from '../../_components/confirmModal'
import GetChatList from '../_method/getChatList'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function ChatRoom() {
  const router = useRouter()
  const { user } = useAuth()
  const userID = user.id
  const userNick = user.nickname
  const userUrl = user.ava_url

  const roomID = useParams().roomID
  const [messages, setMessages] = useState([])
  const messagesRef = useRef()
  const inputRef = useRef()

  const { data, isLoading, error } = useSWR(
    `http://localhost:3005/api/forum/chat?userID=${userID}&roomID=${roomID}`,
    fetcher
  )
  const roomHeader = data?.roomHeader?.[0] || {}

  useEffect(() => {
    if (data?.messages?.[0]?.msg) {
      console.log(data?.messages?.[0]?.msg)
      setMessages(JSON.parse(data?.messages?.[0].msg))
    } //QU 沒if data的話會無限迴圈
  }, [data])

  const ws = new ReconnectingWebSocket('ws://localhost:8080')

  useEffect(() => {
    const handleMessage = async (event) => {
      const newMsg = await event.data.text().then((txt) => JSON.parse(txt))
      // console.log(newMsg)
      setMessages([...messages, newMsg])
    }
    ws.addEventListener('message', handleMessage)
    const msgCurr = messagesRef.current
    if (msgCurr) msgCurr.scrollTop = msgCurr.scrollHeight
    return () => ws.removeEventListener('message', handleMessage)
  }, [ws])

  // console.log(messages) //sender_id, content, nick, ava_url

  ws.addEventListener('close', (event) => {
    console.log('連線關閉')
  })

  const handleCreateMsg = async (newMsg) => {
    const res = await fetch(
      `http://localhost:3005/api/forum/chat?roomID=${roomID}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newMsg }),
      }
    )
    if (!res.ok) throw new Error('未成功連線')
    return res
  }

  const { mutate } = GetChatList(userID)

  return (
    <>
      <div className="chat-main d-flex flex-column ms-3 h-100 bg-pure-white rounded-3 bg-pure-white shadow-forum">
        <div className="chat-main-header bg-pure-white d-flex gap-2 px-3 py-2 align-items-center shadow-sm fw-medium rounded-top-3">
          <button
            className="chat-main-return d-block d-md-none rounded-circle border-0 p-2"
            onClick={() => {
              router.push('/forum/chat')
            }}
          >
            <i className="bi bi-arrow-left d-flex"></i>
          </button>
          <div className="d-flex">
            {roomHeader.imgs
              ?.split(',')
              .slice(0, 2)
              .map((ava, i) => (
                <div className={`chat-room-avas-${i}`} key={i}>
                  <ComponentsAvatar src={ava} alt={'成員'} classWidth="36" />
                </div>
              ))}
          </div>
          <div className="ms-2 text-truncate">{roomHeader.nicks}</div>
        </div>
        {error ? (
          <div className="d-flex align-items-center justify-content-center h-100">
            連線失敗，請再試一次
          </div>
        ) : isLoading ? (
          <div className="d-flex align-items-center justify-content-center h-100">
            <BeatLoader color="#fd7061" />
          </div>
        ) : (
          <div className="messages-block overflow-hidden h-100">
            <div
              ref={messagesRef}
              className="messages-list overflow-auto px-3 h-100 d-flex flex-column gap-3 pt-3"
            >
              {!messages ? (
                <>開始聊天</>
              ) : (
                messages.map((m, i) => {
                  {
                    /* if (m.sender_id === userID) { */
                  }
                  return (
                    <div
                      className="d-flex align-items-top gap-1 w-100 text-break"
                      key={i}
                    >
                      <div
                        className={`d-flex flex-column ${m.sender_id == userID ? 'ms-auto psForumMsg align-items-end order-0' : 'me-auto peForumMsg order-1'}`}
                      >
                        {/* <div className="fs14 sub-text-color">{m.nick}</div> */}
                        <div
                          className={`message fw-light ${m.sender_id == userID ? 'bg-chat-me text-white' : 'bg-light-hover main-text-color'}`}
                        >
                          <span className="d-block my-2">{m.content}</span>
                        </div>
                      </div>
                      <div
                        className={`card-border rounded-circle mb-auto mb-1 ${m.sender_id === userID ? 'order-1' : 'order-0'}`}
                      >
                        <ComponentsAvatar
                          src={m.ava_url}
                          alt={m.nick}
                          classWidth="35"
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        <div className="chat-input-block bg-pure-white d-flex flex-column gap-1 px-3 py-3 rounded-bottom-3 bottom-0">
          {/* <div className="w-100 bg-main">
            test
          </div> TODO 上傳圖片*/}
          <div className="d-flex gap-1">
            <input
              ref={inputRef}
              className="chat-main-input px-3 py-2 border-0 rounded-pill bg-gray-article w-100"
              type="text"
              placeholder="輸入訊息⋯⋯"
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                  // setMessages([...messages, e.target.value])
                  // ws.send(e.target.value)
                  // NOTE 傳送時自動轉buffer
                  ws.send(
                    JSON.stringify({
                      sender_id: userID,
                      content: e.target.value,
                      nick: userNick,
                      ava_url: userUrl,
                    })
                  )
                  await handleCreateMsg({
                    sender_id: userID,
                    content: e.target.value,
                  })
                  mutate()
                  e.target.value = ''
                }
              }}
            />
            {/* <div className="d-flex align-items-center">
              <input
                name="images"
                type="file"
                id="uploadImage"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                  handleImgUpload(e, userID, inputRef)
                }}
              />
              <label htmlFor="uploadImage" className="">
                <div
                  role="button"
                  className="px-2 py-1 button-clear rounded-circle bg-hovering-gray"
                >
                  <i className="bi bi-image fs20 main-text-color"></i>
                </div>
              </label>
            </div> */}
            <button
              className="px-2 button-clear rounded-circle bg-hovering-gray"
              onClick={() => {
                ws.send(
                  JSON.stringify({
                    sender_id: userID,
                    content: inputRef.current.value,
                    nick: userNick,
                    ava_url: userUrl,
                  })
                )

                handleCreateMsg({
                  sender_id: userID,
                  content: inputRef.current.value,
                })
                mutate()
                inputRef.current.value = ''
              }}
            >
              <i className="bi bi-send-fill fs20 main-color" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
