'use client'

import TipTapEditor from '../tiptap-editor/tiptap-editor'

export default function CourseEditor({ value = '', courseId, onChange }) {
  return (
    <div className="w-full">
      <TipTapEditor value={value} onChange={onChange} courseId={courseId} />
    </div>
  )
}
