'use client'

export default function AccountMenu() {
  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-secondary btn-sm dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        管理員
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        <li>
          <button className="dropdown-item">設定</button>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <button className="dropdown-item text-danger">登出</button>
        </li>
      </ul>
    </div>
  )
}
