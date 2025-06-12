'use client'

import React, { useState, useEffect, useRef } from 'react'

export default function ChatList() {
  // const listRef = useRef(null)
  // let hideTimer = useRef(null)

  // const handleScroll = () => {
  //   const list = listRef.current
  //   list.classList.add('scroll-bar-settings')

  //   clearTimeout(hideTimer.current)
  //   hideTimer.current = setTimeout(() => {
  //     list.classList.remove('scroll-bar-settings')
  //   }, 200)
  // }

  return (
    <>
      <div
        // ref={listRef}
        className="chat-list col col-12 col-md-5 bg-pure-white rounded-3 p-0 mb-3 shadow-forum overflow-hidden position-relative main-text-color"
        // onScroll={handleScroll}
      >
        <div className="chat-list-header d-flex px-3 py-2 fs24 fw-bold position-absolute bg-pure-white rounded-top-3 shadow-sm z-1">
          <span className="me-auto"> 我的訊息</span>
          <button className="button-clear">
            <i className="bi bi-pencil-square"></i>
          </button>
        </div>
        <div className="chat-list-items-block position-absolute overflow-auto fs14 px-3 py-2">
          <div className="chat-list-items">
            <div className="chat-list-item d-flex gap-2 p-4 rounded-3">
              <div className="friend-avatar flex-shrink-0 overflow-hidden">
                {/* <img
                className="d-block w-100 h-100 object-fit-cover"
                src="./images/320.webp"
              /> */}
              </div>
              <div className="friend-info d-flex flex-column gap-1">
                <div className="friend-name-date d-flex justify-content-between">
                  <span className="name me-auto text-nowrap text-truncate">
                    Peyton Chen
                  </span>
                  <span className="date text-nowrap sub-text-color">週三</span>
                </div>
                <div className="cotent-preview text-truncate">
                  新年快樂🧧昨天吃完年夜飯好快樂⋯可是好罪惡⋯⋯
                  偷偷跟你分享年後瘦瘦好物 趁現在買起來 準備年後開始贖罪計畫！
                </div>
              </div>
            </div>
            <div className="chat-list-item d-flex gap-2 p-4 rounded-3">
              <div className="friend-avatar flex-shrink-0 overflow-hidden">
                {/* <img
                className="d-block w-100 h-100 object-fit-cover"
                src="./images/320.webp"
              /> */}
              </div>
              <div className="friend-info d-flex flex-column gap-1">
                <div className="friend-name-date d-flex justify-content-between">
                  <span className="name me-auto text-nowrap text-truncate">
                    Peyton Chen
                  </span>
                  <span className="date text-nowrap sub-text-color">週三</span>
                </div>
                <div className="cotent-preview text-truncate">
                  新年快樂🧧昨天吃完年夜飯好快樂⋯可是好罪惡⋯⋯
                  偷偷跟你分享年後瘦瘦好物 趁現在買起來 準備年後開始贖罪計畫！
                </div>
              </div>
            </div>
            <div className="chat-list-item d-flex gap-2 p-4 rounded-3">
              <div className="friend-avatar flex-shrink-0 overflow-hidden">
                {/* <img
                className="d-block w-100 h-100 object-fit-cover"
                src="./images/320.webp"
              /> */}
              </div>
              <div className="friend-info d-flex flex-column gap-1">
                <div className="friend-name-date d-flex justify-content-between">
                  <span className="name me-auto text-nowrap text-truncate">
                    Peyton Chen
                  </span>
                  <span className="date text-nowrap sub-text-color">週三</span>
                </div>
                <div className="cotent-preview text-truncate">
                  新年快樂🧧昨天吃完年夜飯好快樂⋯可是好罪惡⋯⋯
                  偷偷跟你分享年後瘦瘦好物 趁現在買起來 準備年後開始贖罪計畫！
                </div>
              </div>
            </div>
            <div className="chat-list-item d-flex gap-2 p-4 rounded-3">
              <div className="friend-avatar flex-shrink-0 overflow-hidden">
                {/* <img
                className="d-block w-100 h-100 object-fit-cover"
                src="./images/320.webp"
              /> */}
              </div>
              <div className="friend-info d-flex flex-column gap-1">
                <div className="friend-name-date d-flex justify-content-between">
                  <span className="name me-auto text-nowrap text-truncate">
                    Peyton Chen
                  </span>
                  <span className="date text-nowrap sub-text-color">週三</span>
                </div>
                <div className="cotent-preview text-truncate">
                  新年快樂🧧昨天吃完年夜飯好快樂⋯可是好罪惡⋯⋯
                  偷偷跟你分享年後瘦瘦好物 趁現在買起來 準備年後開始贖罪計畫！
                </div>
              </div>
            </div>
            <div className="chat-list-item d-flex gap-2 p-4 rounded-3">
              <div className="friend-avatar flex-shrink-0 overflow-hidden">
                {/* <img
                className="d-block w-100 h-100 object-fit-cover"
                src="./images/320.webp"
              /> */}
              </div>
              <div className="friend-info d-flex flex-column gap-1">
                <div className="friend-name-date d-flex justify-content-between">
                  <span className="name me-auto text-nowrap text-truncate">
                    Peyton Chen
                  </span>
                  <span className="date text-nowrap sub-text-color">週三</span>
                </div>
                <div className="cotent-preview text-truncate">
                  新年快樂🧧昨天吃完年夜飯好快樂⋯可是好罪惡⋯⋯
                  偷偷跟你分享年後瘦瘦好物 趁現在買起來 準備年後開始贖罪計畫！
                </div>
              </div>
            </div>
            <div className="chat-list-item d-flex gap-2 p-4 rounded-3">
              <div className="friend-avatar flex-shrink-0 overflow-hidden">
                {/* <img
                className="d-block w-100 h-100 object-fit-cover"
                src="./images/320.webp"
              /> */}
              </div>
              <div className="friend-info d-flex flex-column gap-1">
                <div className="friend-name-date d-flex justify-content-between">
                  <span className="name me-auto text-nowrap text-truncate">
                    Peyton Chen
                  </span>
                  <span className="date text-nowrap sub-text-color">週三</span>
                </div>
                <div className="cotent-preview text-truncate">
                  新年快樂🧧昨天吃完年夜飯好快樂⋯可是好罪惡⋯⋯
                  偷偷跟你分享年後瘦瘦好物 趁現在買起來 準備年後開始贖罪計畫！
                </div>
              </div>
            </div>
            <div className="chat-list-item d-flex gap-2 p-4 rounded-3">
              <div className="friend-avatar flex-shrink-0 overflow-hidden">
                {/* <img
                className="d-block w-100 h-100 object-fit-cover"
                src="./images/320.webp"
              /> */}
              </div>
              <div className="friend-info d-flex flex-column gap-1">
                <div className="friend-name-date d-flex justify-content-between">
                  <span className="name me-auto text-nowrap text-truncate">
                    Peyton Chen
                  </span>
                  <span className="date text-nowrap sub-text-color">週三</span>
                </div>
                <div className="cotent-preview text-truncate">
                  新年快樂🧧昨天吃完年夜飯好快樂⋯可是好罪惡⋯⋯
                  偷偷跟你分享年後瘦瘦好物 趁現在買起來 準備年後開始贖罪計畫！
                </div>
              </div>
            </div>
            <div className="chat-list-item d-flex gap-2 p-4 rounded-3">
              <div className="friend-avatar flex-shrink-0 overflow-hidden">
                {/* <img
                className="d-block w-100 h-100 object-fit-cover"
                src="./images/320.webp"
              /> */}
              </div>
              <div className="friend-info d-flex flex-column gap-1">
                <div className="friend-name-date d-flex justify-content-between">
                  <span className="name me-auto text-nowrap text-truncate">
                    Peyton Chen
                  </span>
                  <span className="date text-nowrap sub-text-color">週三</span>
                </div>
                <div className="cotent-preview text-truncate">
                  新年快樂🧧昨天吃完年夜飯好快樂⋯可是好罪惡⋯⋯
                  偷偷跟你分享年後瘦瘦好物 趁現在買起來 準備年後開始贖罪計畫！
                </div>
              </div>
            </div>
            <div className="chat-list-item d-flex gap-2 p-4 rounded-3">
              <div className="friend-avatar flex-shrink-0 overflow-hidden">
                {/* <img
                className="d-block w-100 h-100 object-fit-cover"
                src="./images/320.webp"
              /> */}
              </div>
              <div className="friend-info d-flex flex-column gap-1">
                <div className="friend-name-date d-flex justify-content-between">
                  <span className="name me-auto text-nowrap text-truncate">
                    Peyton Chen
                  </span>
                  <span className="date text-nowrap sub-text-color">週三</span>
                </div>
                <div className="cotent-preview text-truncate">
                  新年快樂🧧昨天吃完年夜飯好快樂⋯可是好罪惡⋯⋯
                  偷偷跟你分享年後瘦瘦好物 趁現在買起來 準備年後開始贖罪計畫！
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
