'use client'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function GetChatList(userID) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/forum/chat?userID=${userID}`
  const { data, isLoading, error, mutate } = useSWR(url, fetcher)

  // 將每項msg從json轉為object
  const rooms = data?.roomList?.map((room) => ({
    ...room,
    // NOTE 防呆
    msg: typeof room.msg === 'string' ? JSON.parse(room.msg) : room.msg,
  }))

  const roomHeaders = data?.roomHeader
  // console.log({ url, data: data?.roomList, rooms, roomHeaders })
  return { isLoading, error, mutate, rooms, roomHeaders }
}

//BUG https://isla-forum-backend-production.up.railway.app/api/forum/chat?userID=1 失敗
