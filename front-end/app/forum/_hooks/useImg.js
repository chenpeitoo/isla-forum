'use client'

import React, { useState, useEffect } from 'react'

export default function UseImg() {
  // 圖片預覽
  const previewImage = (filename, contentRef, modalRef) => {
    const select = window.getSelection()
    let range
    // 確認輸入區域在content內
    if (
      !select ||
      select.rangeCount === 0 ||
      !contentRef.current.contains(select.anchorNode)
    ) {
      // if (!modalRef.current.hasAttribute('aria-hidden')) {
      //   contentRef.current.focus()
      // }
      // contentRef.current.focus() //強制上傳位置為content區域
      range = document.createRange()
      range.selectNodeContents(contentRef.current)
      range.collapse(false)
    } else {
      range = select.getRangeAt(0)
    }
    // 新增圖片
    const img = document.createElement('img')
    const br = document.createElement('br')
    img.setAttribute('class', 'd-block w-50')
    // const br = document.createElement('br')
    // img.src = objectUrl
    img.src = filename
    img.onload = () => {
      URL.revokeObjectURL(filename) //img載入完成後，將暫時用的 Blob URL取消
    }
    range.insertNode(img)
    range.setStartAfter(img)
    range.insertNode(br)
    // range.insertNode(br)
    range.collapse(false)
    select.removeAllRanges()
    select.addRange(range)
    // img src: blob:...3000/970f494f-bc90-4bd7-8919-93a2af43af7f
  }

  // 圖片上傳
  function handleImgUpload(e, userID, contentRef, modalRef) {
    const files = Array.from(e.target.files || [])
    // console.log(files)
    // setImagesList((prev) => [...prev, ...files])
    const imageFD = new FormData()
    imageFD.append('userID', userID)
    files.forEach((f) => {
      imageFD.append('images', f)
    })

    fetch('http://localhost:3005/api/forum/posts/upload-image', {
      method: 'POST',
      body: imageFD,
    })
      .then((res) => {
        if (!res.ok) throw new Error('上傳失敗')
        return res.json() //FIXME 上傳成功的提示
      })
      .then((data) => {
        // console.log(`上傳成功-應該是含url的物件: ${data.filenames}`)
        const { filenames } = data
        const filenamesToUrl = filenames.map(
          (f) => `http://localhost:3005/images/forum/${f}`
        )

        files.forEach((f, i) => {
          const objectUrl = URL.createObjectURL(f)
          const url = filenamesToUrl[i]
          // console.log('inner', filenamesToUrl)
          // console.log(url)
          previewImage(url, contentRef, modalRef)
        })
      })
      .catch((err) => {
        console.log(err) //FIXME 上傳失敗的提示
      })
    // console.log('test')
    e.target.value = []
  }

  return { handleImgUpload }
}
