import { body, validationResult } from 'express-validator'
import dayjs from 'dayjs'
// ==== 引入資料 ====
import { cities } from './express-valid-data/CityCountyData.js'

// ==== 驗證email ====
export const validateEmail = body('email')
  .isEmail()
  .withMessage('請輸入有效的 Email')

// ==== 驗證密碼 ====
export const ValidatePass = body('password')
  .isLength({ min: 5, max: 16 })
  .withMessage('密碼長度為5~16字元間')

// ==== 驗證姓名 ====
export const validateName = body('name')
  .isLength({ min: 2, max: 18 })
  .withMessage('名字請介於2~18個字')
// ==== 驗證姓名 ====
export const validateNickName = body('nickname')
  .isLength({ max: 18 })
  .withMessage('暱稱請小於18個字')

// ==== 驗證地址 ====
export const cityData = cities.map(({ CityName, AreaList }) => {
  return {
    CityName,
    ['AreaName']: AreaList.map((v) => v.AreaName),
    ['ZipCode']: AreaList.map((v) => v.ZipCode),
  }
})
// export const city = '花蓮縣'
// const area = '新城鄉'
const allowedCities = cityData.map((v) => v.CityName)
// const allowedDistricts = cityData
//   .filter((v) => v.CityName === city)
//   .map((v) => v.AreaName)
// const allowedZipCode = cityData
//   .filter((v) => v.CityName === city)
//   .map((v) => v.ZipCode)
export const validateAddress = [
  body('city').isIn(allowedCities).withMessage('不支援的縣市'),

  // body('district').isIn(allowedDistricts).withMessage('不支援的鄉鎮市區'),

  // body('zipcode').isIn(allowedZipCode).withMessage('不支援的郵遞區號'),
]

// ==== 性別認證 ====
export const validateGender = body('gender')
  .isIn(['男', '女'])
  .withMessage('性別只能是「男」或「女」')

// ==== 生日驗證 ====
// console.log(dayjs()['$d'])
// console.log(dayjs('2018-04-13 19:18'))
// console.log(dayjs('12-25-1995', 'MM-DD-YYYY'))
// console.log(dayjs('2018-04-13 19:18').isBefore())
// console.log('dayjs valid: ',dayjs('21').isValid())
export const validateBirthday = body('birthday').custom((value) => {
  if (!dayjs(value, 'YYYY-MM-DD', true).isValid()) {
    throw new Error('生日格式必須為 YYYY-MM-DD')
  }
  if (dayjs(value).isAfter()) {
    throw new Error('生日不能是未來的日期')
  }
  console.log(body('birthday'))
  return true
})

// ==== 電話認證 ====
export const validateTel = body('tel')
  .matches(/^09\d{8}$/)
  .withMessage('（共10碼，開頭為09）')

// ==== 膚質 ====
export const validateSkin = body('skin_type').isIn([
  '乾性',
  '中性',
  '敏感性',
  '',
])

// ==== 統整資料驗證錯誤 ====
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    // return res.status(400).json({ status: 'error', errors: errors.array() })
    return res.status(400).json({ status: 'error', errors: errors.array() })
  }
  next()
}
