'use client'

import { Bell } from 'react-feather'

export default function NotificationMenu() {
  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-secondary btn-sm position-relative"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <Bell size={16} />
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          3
        </span>
      </button>
      <ul
        className="dropdown-menu dropdown-menu-end p-2"
        style={{ minWidth: '250px' }}
      >
        <li>
          <span className="dropdown-item-text fw-bold">🔔 通知</span>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <span className="dropdown-item">您有新的會員註冊</span>
        </li>
        <li>
          <span className="dropdown-item">一筆訂單已完成</span>
        </li>
        <li>
          <span className="dropdown-item">優惠券即將到期</span>
        </li>
        <li>
          <span className="dropdown-item">優惠券即將到期</span>
        </li>
      </ul>
    </div>
  )
}
