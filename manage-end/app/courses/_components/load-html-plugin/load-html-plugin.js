'use client'

import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateNodesFromDOM } from '@lexical/html'
import { $getRoot, ElementNode } from 'lexical'

export default function LoadHtmlPlugin({ html, setEditorStateFn }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!html) return

    const parser = new DOMParser()
    const dom = parser.parseFromString(html, 'text/html')

    editor.update(() => {
      const nodes = $generateNodesFromDOM(editor, dom)
      const root = $getRoot()
      root.clear()

      for (const node of nodes) {
        // ✅ 改用 instanceof 檢查是否為可插入的 ElementNode
        if (node instanceof ElementNode) {
          root.append(node)
        }
      }

      const editorState = editor.getEditorState()
      setEditorStateFn(() => () => editorState)
    })
  }, [html, editor, setEditorStateFn])

  return null
}
