'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import './_style/user-upload-ava.css'

export default function UploadAva({
  openAvatar = false,
  setOpenAvatar = () => {},
}) {
  const [image, setImage] = useState(null) // input control for avatar
  const [preview, setPreview] = useState(null) // preview avatar
  const switcher = openAvatar ? 'd-block' : 'd-none' // show or close panel
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
    setPreview(URL.createObjectURL(file)) // 顯示預覽
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) return alert('請選擇圖片')

    const formData = new FormData()
    formData.append('image', image)

    try {
      const token = localStorage.getItem('jwtToken')
      await fetch('http://localhost:3005/api/member/avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <div
        className={'position-absolute top-0 left-0 w-100 z-3' + ' ' + switcher}
      >
        <div className="upload-panel">
          <div className="ava-demo">
            {preview && (
              <Image
                src={preview}
                alt="preview avatar"
                width={280}
                height={280}
              />
            )}
          </div>
          <form
            action=""
            encType="multipart/form-data"
            className="d-flex flex-column gap-2"
            onSubmit={handleSubmit}
          >
            <label htmlFor="avatar">請上傳大頭照</label>
            <input type="file" name="avatar" onChange={handleFileChange} />
            <button className="btn btn-primary">傳送</button>
          </form>

          <button
            className="user-avatar-cls-btn"
            type="button"
            onClick={() => {
              setOpenAvatar(!openAvatar)
            }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
    </>
  )
}
