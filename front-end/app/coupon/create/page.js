'use client'

import useSWR from 'swr'
import '../_components/coupon.css'
import CouponLoading from '../_components/coupon-loading'
import CouponCard from '../_components/coupon-card'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useAuth } from '@/hook/use-auth'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const questions = [
  {
    title: '您的膚質？',
    type: 'single',
    options: [
      { label: '油性肌膚', image: '/images/coupon/oil-skin.jpeg' },
      { label: '乾性肌膚', image: '/images/coupon/dry-skin.webp' },
      { label: '敏感肌膚', image: '/images/coupon/sensitive-skin.jpg' },
      { label: '混合肌膚', image: '/images/coupon/combination-skin.webp' },
    ],
  },
  {
    title: '您喜愛的品牌？',
    type: 'single',
    options: [
      { label: 'kaja', image: '/images/coupon/kaja.png' },
      { label: 'rom&nd', image: '/images/coupon/rom&nd.png' },
      { label: 'unleashia', image: '/images/coupon/unleashia.png' },
      { label: 'COSNORI', image: '/images/coupon/cosnori.png' },
      { label: "A'pieu", image: '/images/coupon/apieu.png' },
      { label: 'MUZIGAE', image: '/images/coupon/muzigae.png' },
    ],
  },
  {
    title: '近日想購買的產品？',
    type: 'single',
    options: [
      { label: '眼部彩妝', image: '/images/coupon/eye.jpg' },
      { label: '唇部彩妝', image: '/images/coupon/lipstick.jpg' },
      { label: '臉頰彩妝', image: '/images/coupon/gloss.jpg' },
      { label: '眉部彩妝', image: '/images/coupon/foundation.jpg' },
      { label: '底妝', image: '/images/coupon/cushion.jpg' },
    ],
  },
]

export default function CreatePage() {
  const { user } = useAuth()
  const url = user
    ? `http://localhost:3005/api/coupon/products/member?user_id=${user.id}`
    : null
  const { data, error } = useSWR(url, fetcher)

  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState(Array(questions.length).fill(''))
  const [fadeState, setFadeState] = useState('fade-in')
  const [isLoading, setIsLoading] = useState(false)
  // 顯示成功創建優惠券
  const [showModal, setShowModal] = useState(false)
  const [newCoupon, setNewCoupon] = useState(null)
  // loading end show modal
  const [isReadyToShowModal, setIsReadyToShowModal] = useState(false)

  const handleOptionClick = (value) => {
    const newAnswers = [...answers]
    newAnswers[currentStep] = value
    setAnswers(newAnswers)
  }

  const goToStep = (nextStep) => {
    setFadeState('fade-out')
    setTimeout(() => {
      setCurrentStep(nextStep)
      setFadeState('fade-in')
    }, 300)
  }

  const handleSubmit = async () => {
    const [skin, brand, product] = answers
    const user_id = user?.id
    const skinTypeId = { 油性肌膚: 1, 乾性肌膚: 2, 敏感肌膚: 3, 混合肌膚: 4 }[
      skin
    ]
    const brandId = {
      kaja: 5,
      'rom&nd': 6,
      unleashia: 1,
      COSNORI: 3,
      "A'pieu": 2,
      MUZIGAE: 4,
    }[brand]
    const categoryId = {
      眼部彩妝: 1,
      唇部彩妝: 2,
      臉頰彩妝: 3,
      眉部彩妝: 4,
      底妝: 5,
    }[product]

    try {
      console.log('開始 loading')
      setIsLoading(true)

      const res = await fetch(
        'http://localhost:3005/api/coupon/products/member',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id,
            brand_id: brandId,
            category_id: categoryId,
            skin_type_id: skinTypeId,
          }),
        }
      )

      const result = await res.json()
      if (result.status === 'success') {
        setNewCoupon(result.data)
        setIsReadyToShowModal(true) // 等動畫完成後再顯示 modal
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error('送出錯誤:', error)
      alert('系統錯誤')
    }
  }
  // 進度條
  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  return (
    <>
      <CouponLoading
        visible={isLoading}
        onComplete={() => {
          console.log('動畫完成')
          setIsLoading(false)
          if (isReadyToShowModal) {
            console.log('顯示 modal')
            setShowModal(true)
            setIsReadyToShowModal(false)
          }
        }}
      />

      {/* 創建成功 modal */}
      {showModal && newCoupon && (
        <>
          <div className="modal-overlay-blur"></div>
          <div className="coupon-modal animate-fade-in d-flex flex-column">
            <CouponCard
              title={newCoupon.title}
              description={newCoupon.description}
              brand_id={newCoupon.brand_id}
              categories={newCoupon.category_id}
              coupon_id={newCoupon.id}
              user_id={user?.id}
              course_categories_id={newCoupon.course_categories_id || 0}
              type_id={5}
              state_id={1}
              claimed_at={null}
              area={1}
              couponstyle="button-purple"
              valid_to={newCoupon.valid_to}
              isLogin={() => {}}
            />
            <div className="mt-4 d-flex flex-column gap-3">
              <Link href="/member/coupon" className="text-center">
                <button className="btn btn-primary w-50 text-center">
                  會員中心
                </button>
              </Link>
              <Link
                href={`/product?brand_id=${newCoupon.brand_id}&categories=${newCoupon.categories}`}
                // product?brandIds=${brand_id}&categoryIds=${categories}
                className="text-center"
              >
                <button className="btn btn-primary w-50 text-center">
                  立即購買
                </button>
              </Link>
            </div>
          </div>
        </>
      )}

      <div className="progress mb-4" style={{ height: 10 }}>
        <div
          className="progress-bar bg-warning"
          role="progressbar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="container position-relative">
        <div className="text-center mb-3">
          <small className="text-muted">
            第 {currentStep + 1} / 共 {questions.length} 題
          </small>
          <div>
            <Link
              href="/"
              className="position-absolute end-0 top-0 sub-text text-decoration-none fs-5"
            >
              略過
            </Link>
          </div>
        </div>

        <div className="text-center mb-5 pt-4">
          <h3 className="main-color mb-0">歡迎加入 ISLA 🥳</h3>
          <h3 className="main-color mb-5">創造出屬於您的優惠券</h3>
          <h6 className="main-text">
            請告訴我們您的膚質狀況，我們將推薦相關商品給您!
          </h6>
        </div>

        <section className={`py-4 text-center ${fadeState}`} key={currentStep}>
          <h4 className="brown-text fw-bold mb-5">{currentQuestion.title}</h4>
          <div className="row justify-content-center g-3 mb-5">
            {currentQuestion.options.map((opt, i) => (
              <div key={i} className="col-6 col-sm-4 col-md-3 col-lg-2">
                <button
                  type="button"
                  className={`image-option w-100 ${
                    answers[currentStep] === opt.label ? 'selected' : ''
                  }`}
                  onClick={() => handleOptionClick(opt.label)}
                >
                  <Image
                    src={opt.image}
                    alt={opt.label}
                    width={300}
                    height={150}
                    className="img-fluid rounded shadow-sm mb-2"
                  />
                  <div className="hover-text">{opt.label}</div>
                </button>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-center gap-3">
            {currentStep > 0 && (
              <button
                className="btn btn-primary btn-prev px-5 py-2"
                onClick={() => goToStep(currentStep - 1)}
              >
                上一題
              </button>
            )}
            {currentStep < questions.length - 1 ? (
              <button
                className="btn btn-primary btn-next px-5 py-2"
                onClick={() =>
                  answers[currentStep] && goToStep(currentStep + 1)
                }
              >
                下一題
              </button>
            ) : (
              <button
                className="btn btn-primary btn-next btn-submit px-5 py-2"
                onClick={handleSubmit}
              >
                生成專屬優惠券
              </button>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
