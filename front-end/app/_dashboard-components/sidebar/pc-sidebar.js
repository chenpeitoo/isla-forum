'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import menuItems from './sidebar-menu'

export default function PcSidebar() {
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [openMenus, setOpenMenus] = useState(() => {
    const initial = {}
    for (let item of menuItems) {
      if (pathname.startsWith(item.basePath)) {
        initial[item.title] = true // ← 改這裡
      }
    }
    return initial
  })

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title], // ← 改這裡
    }))
  }

  return (
    <ul className="nav flex-column">
      {menuItems.map((item) => {
        const isOpen = openMenus[item.title] || false // ← 改這裡
        return (
          <li className="nav-item" key={item.title}>
            <button
              onClick={() => toggleMenu(item.title)}
              className="btn btn-toggle d-flex justify-content-between align-items-center w-100 text-start"
            >
              <span>{item.name}</span>
              <i
                className={`bi bi-chevron-right toggle-icon ${isOpen ? 'rotate' : ''}`}
              />
            </button>

            <ul
              className={`submenu nav flex-column ms-3 mt-1 ${isOpen ? 'open' : ''}`}
            >
              {item.children.map((child, index) => {
                const isActive = isClient && pathname === child.href
                return (
                  <li key={index}>
                    <Link
                      href={child.href}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                    >
                      {child.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}
