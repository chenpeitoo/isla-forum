'use client'

import '../../_components/forum.css'
import React, { useState, useEffect, useRef } from 'react'
import ComponentsAvatar from '../../_components/avatar'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import UseFollow from '../../_hooks/useFollow'
import { useAuth } from '../../../../hook/use-auth'
import Ripples from 'react-ripples'
import UseAddChat from '../_method/useAddChat'
import GetChatList from '../_method/getChatList'

export default function ComponentsAddChat({ listMutate }) {
  const router = useRouter()
  const modalRef = useRef()
  const { user, isAuth } = useAuth()
  const userID = user.id
  const { follows, isLoading, error } = UseFollow(userID)
  const [checkList, setCheckList] = useState([])
  const { handleAddChat } = UseAddChat()

  const { mutate } = GetChatList(userID)

  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div
            className="modal fade"
            id="addChat"
            ref={modalRef}
            tabIndex={-1}
            aria-labelledby="addChatLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable modal-forum">
              <div className="modal-content bg-pure-white">
                <div className="modal-header main-color py-2">
                  <h5
                    className="modal-title main-text-color fs20"
                    id="addChatLabel"
                  >
                    新訊息
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body pt-2 d-flex flex-column">
                  {Array.isArray(follows) &&
                    follows.map((follow, i) => {
                      const isChecked = checkList.includes(follow.follow_id)
                      return (
                        <button
                          className="button-clear d-flex gap-3 align-items-center px-4 py-2 bg-hovering-gray"
                          onClick={(e) => {
                            e.preventDefault()
                            setCheckList(
                              isChecked
                                ? (v) =>
                                    v.filter((id) => id !== follow.follow_id)
                                : (v) => [...v, follow.follow_id]
                            )
                          }}
                          key={i}
                        >
                          <ComponentsAvatar
                            src={follow.follow_img}
                            alt={follow.follow_nick}
                            classWidth="44"
                          />
                          <span>{follow.follow_nick}</span>
                          <i
                            className={`bi ${isChecked ? 'bi-check-circle-fill' : 'bi-circle'} ms-auto main-text-color fs20`}
                          ></i>
                        </button>
                      )
                    })}
                </div>
                <div className="modal-footer d-flex px-3 py-2">
                  <Ripples className="d-flex justify-content-center rounded-3 border-0 bounce flex-grow-1 bg-main">
                    <button
                      className={`text-white button-clear px-4 py-2 w-100 rounded-3`}
                      type="button-bounce"
                      data-bs-dismiss="modal"
                      onClick={async (e) => {
                        e.preventDefault()
                        const newRoomId = await handleAddChat(
                          checkList,
                          userID,
                          listMutate
                        )
                        mutate()
                        router.push(`/forum/chat/${newRoomId}`)
                      }}
                    >
                      聊天
                    </button>
                  </Ripples>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  )
}
