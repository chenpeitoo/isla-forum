// services/emailService.js
import nodemailer from 'nodemailer'

// 用 Gmail 寄信的範例（建議使用應用程式密碼）
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youngliu1998@gmail.com',
    pass: 'bnrl qnah zfel qpsb',
  },
})

async function sendOTPEmail(toEmail, otpCode) {
  const mailOptions = {
    from: 'youngliu1998@gmail.com',
    to: toEmail,
    subject: '您的驗證碼',
    text: `您好，您的驗證碼是：${otpCode}，請在 5 分鐘內完成驗證。`,
  }

  return transporter.sendMail(mailOptions)
}

export default sendOTPEmail
