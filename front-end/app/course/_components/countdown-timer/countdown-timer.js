'use client'

import { useEffect, useState } from 'react'

export default function CountdownTimer({ endTime }) {
  const calculateTimeLeft = () => {
    const difference = new Date(endTime).getTime() - new Date().getTime()
    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  if (
    !timeLeft.days &&
    !timeLeft.hours &&
    !timeLeft.minutes &&
    !timeLeft.seconds
  ) {
    return <span>活動已結束</span>
  }

  return (
    <span>
      剩餘 {timeLeft.days} 天 {timeLeft.hours} 時 {timeLeft.minutes} 分{' '}
      {timeLeft.seconds} 秒
    </span>
  )
}
