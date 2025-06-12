import Link from 'next/link'
import './_styles/not-found.css'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="not-found my-5 py-5">
      <div className="not-found-box">
        <div className="not-found-logo">ERROR</div>
        <div className="not-found-error-block ">404</div>
        <div className="not-found-context-container mb-5">
          <h2>找不到網頁</h2>
          <h4>/ Page Not Found</h4>
        </div>
        <Link href={'/'}>
          <div className={'btn not-found-btn'}>返回首頁</div>
        </Link>
      </div>
    </div>
  )
}
