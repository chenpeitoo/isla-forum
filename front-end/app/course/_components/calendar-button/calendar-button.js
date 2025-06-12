'use client'

import { AddToCalendarButton } from 'add-to-calendar-button-react'

function parseActivityData(str) {
  // 範例輸入：'2025.06.19 (四) 10:30 - 18:30'
  if (!str || typeof str !== 'string') return { start: '', end: '' }

  try {
    const [dateRaw, timeRange] = str.split(')').map((s) => s.trim())
    const dateFormatted = str.split('(')[0].replace(/\./g, '-').trim()

    let [startTime, endTime] = timeRange.split('-').map((s) => s.trim())

    // ⬇️ 自動格式修正器：支援 930、9:0、09:0 等 ➝ 09:30
    const fixTimeFormat = (t) => {
      // 如果是 HH:MM 格式
      if (/^\d{1,2}:\d{1,2}$/.test(t)) {
        const [h, m] = t.split(':')
        return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`
      }
      // 如果是 HHMM 或 HMM 整數格式（如 930、1030）
      if (/^\d{3,4}$/.test(t)) {
        const h = t.length === 3 ? `0${t[0]}` : t.slice(0, 2)
        const m = t.slice(-2)
        return `${h}:${m}`
      }
      // 格式錯誤
      return ''
    }

    startTime = fixTimeFormat(startTime)
    endTime = fixTimeFormat(endTime)

    if (!dateFormatted || !startTime || !endTime)
      throw new Error('解析時間失敗')

    const start = `${dateFormatted}T${startTime}:00`
    const end = `${dateFormatted}T${endTime}:00`

    return { start, end }
  } catch (err) {
    console.warn('活動時間解析失敗：', str)
    return { start: '', end: '' }
  }
}

export default function CalendarButton({ activityData, title, location }) {
  const { start, end } = parseActivityData(activityData)

  // 防呆處理：資料不完整就不渲染按鈕
  if (!start.includes('T') || !end.includes('T')) return null

  const [startDate, startTime] = start.split('T')
  const [endDate, endTimeFull] = end.split('T')
  const endTime = endTimeFull.slice(0, 5)

  return (
    <AddToCalendarButton
      name={title}
      startDate={startDate}
      startTime={startTime.slice(0, 5)}
      endDate={endDate}
      endTime={endTime}
      location={location}
      options={['Apple', 'Google', 'Yahoo', 'iCal']}
      timeZone="Asia/Taipei"
    />
  )
}
