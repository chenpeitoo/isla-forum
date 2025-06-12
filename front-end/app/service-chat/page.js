// /frontend/components/ChatBox.js
'use client'
import { useState, useEffect, useRef } from 'react'

export default function ChatBox() {
  // const [input, setInput] = useState('') // 使用者輸入文字
  // const [messages, setMessages] = useState([]) // 訊息陣列：{ role: 'user'|'assistant', content: string }
  // const messagesEndRef = useRef(null)

  // // 捲動到最底部
  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  // }

  // useEffect(() => {
  //   scrollToBottom()
  // }, [messages])

  // // 處理送出按鈕
  // const handleSend = async () => {
  //   if (!input.trim()) return
  //   const newUserMsg = { role: 'user', content: input.trim() }
  //   // 先把 user 訊息加到 local state
  //   setMessages((prev) => [...prev, newUserMsg])
  //   setInput('')

  //   try {
  //     // 呼叫後端 API
  //     const res = await fetch('http://localhost:5000/api/chat', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         message: input.trim(),
  //         history: messages, // 把目前訊息當作 history，讓機器人有上下文
  //       }),
  //     })
  //     const data = await res.json()

  //     // 把機器人回覆加入 messages
  //     setMessages((prev) => [...prev, data.newMessage])
  //   } catch (err) {
  //     console.error(err)
  //     setMessages((prev) => [
  //       ...prev,
  //       { role: 'assistant', content: '⚠️ 伺服器錯誤，請稍後再試。' },
  //     ])
  //   }
  // }

  // // 按下 Enter 也能送出
  // const handleKeyDown = (e) => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     e.preventDefault()
  //     handleSend()
  //   }
  // }

  return (
    <div style={styles.container}>
      {/* <div style={styles.chatWindow}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? '#DCF8C6' : '#ECECEC',
            }}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div> */}
      <div style={styles.inputArea}>
        <textarea
          style={styles.textarea}
          rows={2}
          placeholder="輸入訊息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        ></textarea>
        <button style={styles.sendButton} onClick={handleSend}>
          送出
        </button>
      </div>
    </div>
  )
}

// const styles = {
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     height: '100vh',
//     maxWidth: '600px',
//     margin: '0 auto',
//     padding: '16px',
//   },
//   chatWindow: {
//     flex: 1,
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     padding: '12px',
//     overflowY: 'auto',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px',
//     backgroundColor: '#FAFAFA',
//   },
//   message: {
//     maxWidth: '80%',
//     padding: '8px 12px',
//     borderRadius: '16px',
//     lineHeight: 1.4,
//   },
//   inputArea: {
//     display: 'flex',
//     gap: '8px',
//     marginTop: '12px',
//   },
//   textarea: {
//     flex: 1,
//     resize: 'none',
//     padding: '8px',
//     borderRadius: '8px',
//     border: '1px solid #ccc',
//     fontSize: '14px',
//     fontFamily: 'sans-serif',
//   },
//   sendButton: {
//     padding: '0 16px',
//     borderRadius: '8px',
//     border: 'none',
//     backgroundColor: '#0070f3',
//     color: '#fff',
//     cursor: 'pointer',
//   },
// }
