'use client'

import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import { toast } from 'react-toastify'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function UseFollow(userID, followID) {
  const { data, isLoading, error, mutate } = useSWR(
    `http://localhost:3005/api/forum/follow?followID=${followID}&userID=${userID}`,
    fetcher
  )
  console.log(
    `http://localhost:3005/api/forum/follow?followID=${followID}&userID=${userID}`
  )
  const isFollow = data?.data.includes(userID)
  const followCount = data?.data.length
  const follows = data?.follows
  const method = isFollow ? 'DELETE' : 'POST'

  const handleFollow = async () => {
    // console.log({ method, isFollow })
    const res = await fetch(`http://localhost:3005/api/forum/follow`, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followID, userID }),
    })
    if (!res.ok) toast('請稍後再試')
    const result = await res.json()
    if (result.data) {
      toast(result.message)
    }
    mutate()
    // followMutate()
  }
  if (isLoading || error || data.status !== 'success')
    return { isLoading, error, status: data?.status }

  return { handleFollow, isFollow, followCount, follows, isLoading, error }
}
