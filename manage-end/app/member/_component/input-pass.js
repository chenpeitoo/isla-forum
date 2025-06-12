'use client'

import clsx from 'clsx'

export default function InputPass({
  password = {},
  title = '',
  name = '',
  value = '',
  setPassword = () => {},
  errorMsg = '',
}) {
  // const [passType, setPassType] = useState('password')
  return (
    <>
      <div className={clsx(['user-form-input'], errorMsg && 'user-error')}>
        <label htmlFor={name}>
          {title}
          <span>{errorMsg}</span>
        </label>
        <input
          type="password"
          name={name}
          value={value}
          onChange={(e) => {
            setPassword({ ...password, [name]: e.target.value })
          }}
          className="form-control"
        />
        {/* show password or not */}
        {/* <button
          className="passEye"
          onClick={() => {
            switch (passType) {
              case 'password':
                setPassType('Text')
                break
              case 'text':
                setPassType('password')
            }
          }}
        >
          <i className="bi bi-eye"></i>
        </button> */}
      </div>
    </>
  )
}
