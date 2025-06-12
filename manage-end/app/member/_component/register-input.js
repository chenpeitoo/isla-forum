'use client'

import clsx from 'clsx'

export default function RegisterInput({
  title = '',
  name = 'account',
  type = 'text',
  value = '',
  text = '',
  setText = (f) => {
    f
  },
  disabled = '',
  errorMsg = '',
}) {
  const isStar = name == 'email' || name == 'birthday' ? '*' : ''
  return (
    <>
      <div className={clsx(['register-input-block'], errorMsg && 'user-error')}>
        <label htmlFor={name}>
          {title}
          <span className="user-star">{isStar}</span>
        </label>
        <input
          className="form-control"
          disabled={disabled}
          type={type}
          name={name}
          value={value}
          onChange={(e) => {
            setText({ ...text, [name]: e.target.value })
          }}
          placeholder={errorMsg}
        />
      </div>
    </>
  )
}
