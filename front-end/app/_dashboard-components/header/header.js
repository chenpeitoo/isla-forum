'use client'

import '../dashboard.css'
import { useState } from 'react'
import Sidebar from '../sidebar/mobile-sidebar'
import NotificationMenu from './notification-menu'
import AccountMenu from './account-menu'

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <>
      <nav className="header-container navbar navbar-expand-lg px-4 py-3 border-bottom bg-white">
        <div className="container-fluid justify-content-between align-items-center">
          <button
            className="hamburger btn btn-outline-secondary d-lg-none me-3"
            onClick={() => setSidebarOpen(true)}
          >
            <i className="bi bi-list fs-4"></i>
          </button>

          <a
            className="navbar-brand text-danger fw-bold fs-4"
            href="/dashboard"
          >
            ISLA Company
          </a>

          <div className="d-flex align-items-center gap-3">
            <NotificationMenu />
            <AccountMenu />
          </div>
        </div>
      </nav>

      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
    </>
  )
}
