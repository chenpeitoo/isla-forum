'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import '../dashboard.css'
import menuItems from './sidebar-menu'

export default function Sidebar({ onClose = () => {} }) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState({})
  const [isClosing, setIsClosing] = useState(false)

  // 自動展開符合 pathname 的選單
  useEffect(() => {
    for (let item of menuItems) {
      if (pathname.startsWith(item.basePath)) {
        setOpenMenus((prev) => ({
          ...prev,
          [item.id]: true,
        }))
        break
      }
    }
  }, [pathname])

  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

  const handleLinkClick = (href) => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
      window.location.href = href
    }, 300)
  }

  return (
    <div
      className={`position-fixed top-0 start-0 bg-white w-75 h-100 shadow sidebar-slide ${isClosing ? 'closing' : ''}`}
      style={{ zIndex: 1055 }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="mb-0">選單</h5>
        <button className="btn-close" onClick={handleClose}></button>
      </div>

      <div className="p-3">
        <ul className="nav flex-column">
          {menuItems.map((item) => {
            const isOpen = openMenus[item.id] || false
            return (
              <li className="nav-item" key={item.id}>
                <button
                  onClick={() => toggleMenu(item.id)}
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
                  {item.children.map((child, index) => (
                    <li key={index}>
                      <Link
                        href={child.href}
                        className="nav-link"
                        onClick={(e) => {
                          e.preventDefault()
                          handleLinkClick(child.href)
                        }}
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
