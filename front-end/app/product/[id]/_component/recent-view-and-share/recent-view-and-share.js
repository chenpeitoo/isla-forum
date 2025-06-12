'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import Image from 'next/image'
import './recent-view-and-share.css'
import { FaFacebook, FaLine, FaLink } from 'react-icons/fa'

export default function ReactViewShare({ product }) {
  const [recentProducts, setRecentProducts] = useState([])

  useEffect(() => {
    if (!product) return

    const key = 'recent_viewed'
    let viewed = JSON.parse(localStorage.getItem(key)) || []

    viewed = viewed.filter((p) => p.product_id !== product.product_id)
    viewed.unshift({
      product_id: product.product_id,
      name: product.name,
      image: product.images?.[0]?.image_url,
    })

    viewed = viewed.slice(0, 5)
    localStorage.setItem(key, JSON.stringify(viewed))
    setRecentProducts(viewed)
  }, [product])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const encodedUrl = encodeURIComponent(shareUrl)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast.success('已複製分享連結！')
  }

  return (
    <div className="left-floating-bar">
      {/* 最近瀏覽 */}
      <div className="floating-section">
        <div className="floating-title">最近瀏覽</div>
        {recentProducts.map((p) => (
          <Link key={p.product_id} href={`/product/${p.product_id}`}>
            <Image
              src={`https://isla-image.chris142852145.workers.dev/${p.image}`}
              alt={p.name}
              width={50}
              height={50}
              className="floating-thumb"
            />
          </Link>
        ))}
      </div>

      {/* 分享功能 */}
      <div className="floating-section">
        <div className="floating-title">分享</div>

        <Link
          className="share-btn icon-btn"
          href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="分享到 LINE"
        >
          <FaLine size={20} />
        </Link>

        <Link
          className="share-btn icon-btn"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="分享到 Facebook"
        >
          <FaFacebook size={20} />
        </Link>

        <button
          className="share-btn icon-btn"
          onClick={handleCopyLink}
          title="複製連結"
        >
          <FaLink size={20} />
        </button>
      </div>
    </div>
  )
}
