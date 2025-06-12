'use client'
import IslaSwitch from '../../_components/form/switch/form-switch'
import './coupon.css'

export default function CouponFilterNav({
  type = '', // 給會員中心-我的優惠券用
  options = [], // li選項
  currentValue, // 當前選擇的值加上active
  onChange, // 切換選項時的處理函式
  showSwitch = false, // 顯示已領取
  isChecked = false, // 開關是否打開
  onToggleSwitch = () => {}, // 點擊開關時
}) {
  const isMember = type === 'member'
  return (
    <ul
      className={`sub-text nav justify-content-center justify-content-md-start mt-3 ${
        isMember
          ? 'd-flex flex-wrap justify-content-center'
          : 'd-none d-md-flex justify-content-md-start'
      }`}
    >
      {options.map((item) => (
        <li
          key={item.value}
          className="hover-underline nav-item col-3 col-sm-auto"
        >
          <a
            href="#"
            className={`nav-link sub-text px-0 px-md-2 px-lg-3 text-center ${
              currentValue === item.value ? 'active' : ''
            }`}
            onClick={(e) => {
              e.preventDefault()
              onChange(item.value)
            }}
          >
            {item.label}
          </a>
        </li>
      ))}

      {showSwitch && (
        <div className="d-flex align-items-center ms-2">
          <div className="ms-auto d-flex align-items-center">
            <IslaSwitch
              checked={isChecked}
              onChange={onToggleSwitch}
              size="medium"
            />
            <label className="ps-2">顯示已領取</label>
          </div>
        </div>
      )}
    </ul>
  )
}
