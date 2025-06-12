'use client'

import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      'keydown',
      (event) => {
        if (event.ctrlKey && event.key === 'b') {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
          return true
        }
        return false
      },
      0
    )
  }, [editor])

  return (
    <div className="toolbar">
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
        加粗
      </button>
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>
        斜體
      </button>
    </div>
  )
}
