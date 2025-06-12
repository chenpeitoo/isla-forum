'use client'

import React, { useState, useEffect } from 'react'

export default function ChatRoom({ roomID = '' }) {
  return (
    <>
      <div className="chat-room col col-11 col-md-7 p-0 d-none d-md-block overflow-auto">
        <div className="chat-main d-flex flex-column position-relative h-100 bg-pure-white rounded-3 ms-3 shadow-forum overflow-hidden">
          <div className="chat-main-header d-flex gap-2 px-3 py-2 align-items-center shadow-sm fs20 fw-bold">
            <button className="chat-main-return d-block d-md-none">
              <i className="bi bi-arrow-left"></i>
            </button>
            <div className="chat-main-avatar rounded-circle flex-shrink-0 overflow-hidden">
              {/* <img
                className="d-block w-100 h-100 object-fit-cover"
                src="./images/320.webp"
              /> */}
            </div>
            <span className="d-inline-block">lillypolly roomID:{roomID}</span>
          </div>
          <div className="messages-block px-4" />
          <input
            className="chat-main-input position-absolute px-3 py-2 border-0 rounded-pill bg-gray-article"
            type="text"
            placeholder="輸入訊息⋯⋯"
          />
        </div>
      </div>
    </>
  )
}
