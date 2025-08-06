'use client'

import React, { useState, useEffect } from 'react'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function GetChatList(userID) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/forum/chat?userID=${userID}`
  const { data, isLoading, error, mutate } = useSWR(url, fetcher)

  const rooms = data?.roomList?.map((room) => ({
    ...room,
    msg: JSON.parse(room.msg),
  }))
  const roomHeader = data?.roomHeader
  return { isLoading, error, mutate, rooms, roomHeader }
}

//BUG https://isla-forum-backend-production.up.railway.app/api/forum/chat?userID=1 失敗