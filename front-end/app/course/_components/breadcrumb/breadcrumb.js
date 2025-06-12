'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  getCoursePath,
  getExperiencePath,
  getTeacherPath,
} from '../../../_components/path/_method/course-path'

export default function Breadcrumb({ type, path, current, className = '' }) {
  const [title, setTitle] = useState('')

  // 顯示名稱對照
  const labelMap = {
    course: '美妝教室',
    experience: '美妝教室',
    teacher: '美妝教室',
  }

  // 第二層連結對照
  const typeUrlMap = {
    course: '/course',
    experience: '/course',
    teacher: '/course',
  }
  // 否則使用 type + path 模式，從 API 取得標題
  useEffect(() => {
    const fetchTitle = async () => {
      let t = ''
      if (type === 'course') t = await getCoursePath(path)
      else if (type === 'experience') t = await getExperiencePath(path)
      else if (type === 'teacher') t = await getTeacherPath(path)
      setTitle(t)
    }
    if (type && path) fetchTitle()
  }, [type, path])

  // 如果傳入 current，則直接渲染靜態麵包屑
  if (current) {
    return (
      <div
        className={`text-sm  bread-crumbs ${className}`}
        style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
      >
        <Link href="/" className="bread-crumbs">
          首頁
        </Link>{' '}
        /{' '}
        <Link href="/course" className="bread-crumbs">
          美妝教室
        </Link>{' '}
        / <span>{current}</span>
      </div>
    )
  }

  return (
    <div
      className={`text-sm  bread-crumbs ${className}`}
      style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
    >
      <Link href="/" className="bread-crumbs">
        首頁
      </Link>{' '}
      /{' '}
      <Link href={typeUrlMap[type] || '/'} className="bread-crumbs">
        {labelMap[type] || type}
      </Link>{' '}
      / <span>{title}</span>
    </div>
  )
}
