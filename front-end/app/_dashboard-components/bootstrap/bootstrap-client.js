'use client'
import { useEffect } from 'react'

export default function BootstrapClient() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
  }, [])

  return null
}

// 以下功能需引入此檔
// Modal 模態框、Dropdown 下拉選單、Collapse 折疊收合、Offcanvas 側邊欄、Tooltip 工具提示、Toast 通知提示
