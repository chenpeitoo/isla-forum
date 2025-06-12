'use client'

import clsx from 'clsx'

export default function Select({
  title = '',
  name = '',
  arr = [],
  selectKey = '',
  text = {},
  postCode = '',
  setText = () => {},
  errorMsg = '',
}) {
  // console.log('text', text)
  // console.log('selectKey', selectKey)
  // console.log('text.selectKey', text[`${selectKey}`])
  console.log('errorMsg: ', errorMsg)
  return (
    <>
      <div className={clsx(['user-form-input'], errorMsg && 'user-error')}>
        <label htmlFor={name}>
          {title}
          <span>{errorMsg}</span>
        </label>
        <select
          name={name}
          className="form-control"
          defaultValue={text[`${selectKey}`]}
          onChange={(e) => {
            setText({ ...text, [selectKey]: e.target.value })
            // ==== 直接輸入全部 (依照城市預選地區、號碼) ====
            if (selectKey === 'CityName') {
              setText({
                ...text,
                [selectKey]: e.target.value,
                ['AreaName']: arr.filter((v) => {
                  return v['CityName'] === e.target.value
                })[0]['AreaList'][0]['AreaName'],
                ['ZipCode']: arr.filter((v) => {
                  return v['CityName'] === e.target.value
                })[0]['AreaList'][0]['ZipCode'],
              })
            }
            // ==== 直接輸入郵遞區號 (地區即決定號碼) ====
            if (selectKey === 'AreaName') {
              setText({
                ...text,
                [selectKey]: e.target.value,
                ['ZipCode']: arr.filter((v) => {
                  return v['AreaName'] === e.target.value
                })[0]['ZipCode'],
              })
            }
          }}
        >
          <option value={text.selectKey}>
            {text[`${selectKey}`] ? text[`${selectKey}`] : '請選擇'}
          </option>

          {arr.map((v, i) => {
            if (v[selectKey] != text[`${selectKey}`]) {
              return (
                <option value={v[selectKey]} key={i}>
                  {v[selectKey]}
                </option>
              )
            }
          })}
        </select>
      </div>
    </>
  )
}
