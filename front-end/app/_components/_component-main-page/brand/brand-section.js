import Image from 'next/image'
import './_style/brand-section.css'

const logos = [
  '/images/coupon/unleashia.png',
  '/images/coupon/apieu.png',
  '/images/coupon/cosnori.png',
  '/images/coupon/muzigae.png',
  '/images/coupon/kaja.png',
  '/images/coupon/rom&nd.png',
]

export default function BrandSection() {
  // 複製 3 次，確保畫面超出至少 2 輪以上 → 無縫
  const repeated = Array(3).fill(logos).flat()

  return (
    <div className="brand-carousel">
      <div className="brand-track">
        {repeated.map((logo, i) => (
          <div className="brand-logo group" key={i}>
            <Image
              src={logo}
              alt={`brand-${i}`}
              width={200}
              height={200}
              style={{ objectFit: 'contain' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
