import React from 'react'

const IslaSwitch = ({
  checked = false,
  onChange,
  disabled = false,
  size = 'medium',
  label,
  id,
}) => {
  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      handleToggle()
    }
  }

  // 定義不同尺寸的樣式
  const sizeStyles = {
    small: {
      width: '2rem',
      height: '1rem',
      thumbSize: '0.75rem',
      thumbTranslate: 'calc(100% - 0.875rem)',
    },
    medium: {
      width: '3rem',
      height: '1.5rem',
      thumbSize: '1.25rem',
      thumbTranslate: 'calc(100% - 1.375rem)',
    },
    large: {
      width: '4rem',
      height: '2rem',
      thumbSize: '1.75rem',
      thumbTranslate: 'calc(100% - 1.875rem)',
    },
  }

  const currentSize = sizeStyles[size]

  // 容器樣式
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  }

  // 標籤樣式
  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: disabled ? '#9ca3af' : '#374151',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    margin: 0,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }

  // Switch 按鈕樣式
  const switchButtonStyle = {
    width: currentSize.width,
    height: currentSize.height,
    position: 'relative',
    borderRadius: currentSize.height,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: checked
      ? 'linear-gradient(135deg, rgba(253, 112, 97, 0.8), rgba(253, 112, 97, 0.6))'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)', // Safari support
    boxShadow: checked
      ? '0 8px 32px rgba(253, 112, 97, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      : `0 8px 32px rgba(0, 0, 0, 0.1), 
       inset 0 1px 0 rgba(255, 255, 255, 0.2),
       inset 0 2px 4px rgba(0, 0, 0, 0.1),
       inset 0 -1px 2px rgba(0, 0, 0, 0.05)`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: disabled ? 0.5 : 1,
    outline: 'none',
    padding: 0,
    overflow: 'hidden',
  }

  // Focus 狀態樣式
  const focusStyle = {
    boxShadow: checked
      ? '0 8px 32px rgba(253, 112, 97, 0.4), 0 0 0 3px rgba(253, 112, 97, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      : '0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(253, 112, 97, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  }

  // 滑塊樣式
  const thumbStyle = {
    width: currentSize.thumbSize,
    height: currentSize.thumbSize,
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: checked ? currentSize.thumbTranslate : '0.125rem',
    transform: 'translateY(-50%)',
    background:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8))',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)', // Safari support
    boxShadow: checked
      ? '0 4px 16px rgba(253, 112, 97, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
      : '0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
  }

  return (
    <div style={containerStyle}>
      {label && (
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onFocus={(e) => Object.assign(e.target.style, focusStyle)}
        onBlur={(e) => Object.assign(e.target.style, switchButtonStyle)}
        style={switchButtonStyle}
      >
        <span style={thumbStyle} />
      </button>
    </div>
  )
}

export default IslaSwitch
