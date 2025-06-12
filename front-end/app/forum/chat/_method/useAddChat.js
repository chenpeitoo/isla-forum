'use client'

import React, { useState, useEffect } from 'react'

export default function UseAddChat() {
  const handleAddChat = async (list, userID, listMutate) => {
    try {
      const res = await fetch(`http://localhost:3005/api/forum/chat/add-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list: list, userID }),
      })
      if (!res.ok) throw new Error(res.status)

      const data = await res.json()
      return data?.data //傳出新room id
    } catch (error) {
      console.log(error)
    }
    listMutate()
  }
  return { handleAddChat }
}
