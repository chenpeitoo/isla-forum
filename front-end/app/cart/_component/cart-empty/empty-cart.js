'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function EmptyCart() {
  const router = useRouter()

  return (
    <div>
      <Image
        src="/images/cart/empty-cart06.png"
        alt="空購物車"
        width={550}
        height={620}
        style={{ width: '100%', height: 'auto', maxWidth: '550px' }}
      />
      <h5 className="text-maintext mb-3">
        你的購物車是空的，快去選購喜歡的商品吧！
      </h5>
      <button
        className="btn btn-secondary"
        onClick={() => router.push('/product')}
      >
        去逛逛商品吧
      </button>
    </div>
  )
}
