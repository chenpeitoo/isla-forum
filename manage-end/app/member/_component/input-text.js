'use client'

import clsx from 'clsx'

export default function InputText({
  text = {},
  title = '',
  name = '',
  value = '',
  setText = () => {},
  errorMsg = '',
  disabled = '',
}) {
  return (
    <>
      <div className={clsx(['user-form-input'], errorMsg && 'user-error')}>
        <label htmlFor={name}>
          {title}
          <span>{errorMsg}</span>
        </label>
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => {
            setText({ ...text, [name]: e.target.value })
          }}
          className="form-control"
          disabled={disabled}
        />
      </div>
    </>
  )
}
