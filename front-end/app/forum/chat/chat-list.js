'use client'

import Link from 'next/link'
import { useAuth } from '../../../hook/use-auth'
import ComponentsAvatar from '../_components/avatar'
import GetChatList from './_method/getChatList'

// /* TODO 換成幾小時 */

export default function ChatList({ setListMutate }) {
  const userID = useAuth().user.id

  const { rooms, roomHeaders, isLoading, error } = GetChatList(userID)
  // const roomItems = rooms?.map((item) => ({
  //   ...item,
  //   msg: JSON.parse(item.msg),
  // }))
  const roomItems = rooms

  console.log({ rooms, roomItems })
  return (
    <>
      <div className="chat-list-items">
        {error ? (
          <div className="d-flex align-items-center justify-content-center h-100">
            連線失敗，請再試一次
          </div>
        ) : isLoading ? (
          <div className="d-flex align-items-center justify-content-center h-100">
            Loading
          </div>
        ) : (
          roomItems &&
          roomItems.map((item, i) => {
            const date = new Date(item.msg.created_at)
            const dateFormat = `${date.getMonth()}月${date.getDate()}日`
            return (
              <Link
                href={`/forum/chat/${item.room_id}`}
                className="chat-list-item d-flex gap-2 p-3 rounded-3 main-text-color"
                key={i}
              >
                {roomHeaders
                  .filter((v) => v.room_id === item.room_id)[0]
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
                <div className="friend-info d-flex flex-column gap-1 w-100">
                  <div className="friend-name-date d-flex justify-content-between gap-2">
                    <div className="text-truncate">
                      {
                        roomHeaders.filter((v) => v.room_id === item.room_id)[0]
                          .nicks
                      }
                    </div>
                    <div className="date text-nowrap sub-text-color fs14 fw-normal">
                      {dateFormat}
                    </div>
                  </div>
                  <div className="cotent-preview text-truncate sub-text-color fs14 fw-normal">
                    <span className="fw-medium">{item.msg.nick}：</span>
                    <span className="fw-light">{item.msg.content}</span>
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
