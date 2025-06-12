'use client'

export default function Select({
  title = '',
  name = '',
  arr = [],
  selectKey = '',
  text = {},
  postCode = '',
  setText = () => {},
}) {
  // console.log('text', text)
  // console.log('selectKey', selectKey)
  // console.log('text.selectKey', text[`${selectKey}`])
  return (
    <>
      <div className="user-form-input">
        <label htmlFor={name}>{title}</label>
        <select
          name={name}
          className="form-control"
          defaultValue={text[`${selectKey}`]}
          onChange={(e) => {
            setText({ ...text, [selectKey]: e.target.value })
            // ==== 直接輸入郵遞區號 ====
            if (selectKey == 'AreaName') {
              setText({
                ...text,
                ['ZipCode']: arr.filter((v) => {
                  return v['AreaName'] === e.target.value
                })[0]['ZipCode'],
              })
            }
          }}
        >
          <option value={text.selectKey}>{text[`${selectKey}`]}</option>

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
