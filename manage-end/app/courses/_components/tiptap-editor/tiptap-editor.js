'use client'

import { useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Image as DefaultImage } from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import './tiptap-editor.css'
import TextStyle from '@tiptap/extension-text-style'

import {
  FaBold,
  FaItalic,
  FaParagraph,
  FaHeading,
  FaImage,
  FaUpload,
  FaAlignLeft,
  FaAlignRight,
  FaAlignCenter,
  FaEraser,
} from 'react-icons/fa'

// 🔧 自定義 Image 擴充，支援 class
const Image = DefaultImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: '',
        parseHTML: (element) => element.getAttribute('class'),
        renderHTML: (attributes) => {
          return {
            class: attributes.class,
          }
        },
      },
    }
  },
})

const colorPalette = [
  '#000000', // 黑
  '#ff0000', // 紅
  '#ff7f00', // 橙
  '#ffff00', // 黃
  '#00ff00', // 綠
  '#0000ff', // 藍
  '#8b00ff', // 紫
  '#808080', // 灰
  '#00bfff', // 淺藍
  '#ffffff', // 白
]

export default function TipTapEditor({ value, onChange = () => {}, courseId }) {
  const fileInputRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image,
      TextStyle,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      if (typeof onChange === 'function') {
        onChange(html)
      }
    },
  })

  const addImageByUrl = () => {
    const url = window.prompt('請輸入圖片網址')
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file || !courseId) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('courseId', courseId)

    try {
      const res = await fetch(
        `http://localhost:3005/api/courses-manage/course-list/upload?courseId=${courseId}`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const text = await res.text()
      let data = {}
      try {
        data = JSON.parse(text)
      } catch (err) {
        console.error('伺服器未回傳 JSON：', text)
        throw new Error('圖片上傳回傳格式錯誤')
      }

      if (data.url) {
        editor
          ?.chain()
          .focus()
          .setImage({
            src: `http://localhost:3005${data.url}`,
          })
          .run()
      } else {
        alert('圖片上傳失敗')
      }
    } catch (err) {
      console.error('上傳失敗:', err)
      alert('圖片上傳發生錯誤')
    } finally {
      e.target.value = ''
    }
  }

  if (!editor) return <div>載入編輯器中...</div>

  return (
    <div className="rounded p-3 space-y-2">
      {/* 工具列 */}
      <div className="flex flex-wrap gap-2 tiptap">
        {/* 格式化按鈕 */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
        >
          <FaBold /> 粗體
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
        >
          <FaItalic /> 斜體
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
        >
          <FaParagraph /> 內文
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
        >
          <FaHeading /> H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
        >
          <FaHeading className="text-xs" /> H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
        >
          <FaHeading className="text-[10px]" /> H3
        </button>

        {/* 插入圖片 */}
        <button
          onClick={addImageByUrl}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
        >
          <FaImage /> 圖片網址
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
        >
          <FaUpload /> 上傳圖片
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          hidden
        />

        {/* 對齊按鈕 */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
        >
          <FaAlignLeft /> 靠左對齊
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
        >
          <FaAlignCenter /> 置中對齊
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
        >
          <FaAlignRight /> 靠右對齊
        </button>

        {/* 字體顏色調色盤 */}
        <div className="flex items-center gap-1 px-2">
          {colorPalette.map((color) => (
            <button
              key={color}
              onClick={() => editor.chain().focus().setColor(color).run()}
              style={{
                backgroundColor: color,
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
              title={`字色 ${color}`}
            />
          ))}
          <button
            onClick={() => editor.chain().focus().unsetColor().run()}
            className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
          >
            清除
          </button>
        </div>

        {/* 清除格式 */}
        <button
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
        >
          <FaEraser /> 清除格式
        </button>
      </div>

      {/* 編輯器內容 */}
      <EditorContent
        editor={editor}
        className="min-h-[200px] tiptap border p-3 rounded"
      />
    </div>
  )
}
