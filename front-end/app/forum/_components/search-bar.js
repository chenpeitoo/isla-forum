'use client'

import { useState, useRef, useEffect } from 'react'
import { useFilter } from '../_context/filterContext'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ComponentsSearchBar() {
  const router = useRouter()
  const {
    setKeyword,
    keyword,
    setProductCate,
    productCate,
    setPostCate,
    postCate,
    productCateItems,
    postCateItems,
  } = useFilter()
  const keywordInputRef = useRef()
  const [isKeywordEmpty, setKeywordEmpty] = useState(true) //判斷輸入框的x按鈕、清除篩選按鈕是否顯示

  // keyword設定
  const handleKeywordSearch = (e, type) => {
    e.preventDefault()
    let inputKeyword
    if (type === 'clear') {
      inputKeyword = ''
      keywordInputRef.current.value = ''
    } else {
      inputKeyword = keywordInputRef.current.value.trim()
    }
    setKeyword(inputKeyword) //更新context的keyword
    setKeywordEmpty(!inputKeyword)
  }
  useEffect(() => {
    keywordInputRef.current.value = keyword ?? ''
    setKeywordEmpty(keyword ? false : true)
  }, [keyword])

  // 獲取網址參數
  const paramsKeyword = useSearchParams().get('keyword') ?? []
  const paramsProductCate =
    useSearchParams().get('productCate')?.split(',').map(Number) ?? []
  const paramsPostCate =
    useSearchParams().get('postCate')?.split(',').map(Number) ?? []

  // 將網址參數設定至filter context
  useEffect(() => {
    setKeyword(paramsKeyword)
    setProductCate(paramsProductCate)
    setPostCate(paramsPostCate)
  }, [])

  // console.log({ paramsKeyword, paramsProductCate, paramsPostCate })
  // console.log({ keyword, productCate, postCate })
  return (
    <>
      <aside className="aside d-flex flex-column pt-2 position-sticky">
        <form action={`${process.env.NEXT_PUBLIC_API_URL}/api/forum/posts`}>
          <div className="search-bar d-flex flex-row align-items-center bottom-stroke">
            <button
              className="d-inline-block button-clear sub-text-color me-2"
              onClick={handleKeywordSearch}
            >
              <i className="bi bi-search"></i>
            </button>
            <div className="search-header d-flex align-items-center me-auto sub-text-color">
              <input
                ref={keywordInputRef}
                className="keyword-input w-100 px-0 position-relative"
                type="text"
                placeholder="輸入關鍵字"
                onChange={() => {
                  setKeywordEmpty(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                    handleKeywordSearch(e)
                  }
                }}
              />
            </div>
            {!isKeywordEmpty && (
              <button
                className={`search-clear d-inline-block button-clear sub-text-color pe-1`}
                onClick={(e) => {
                  handleKeywordSearch(e, 'clear')
                }}
              >
                <i className="bi bi-x fs20"></i>
              </button>
            )}
          </div>
        </form>

        <div className="cate ps-1">
          <div className="cate-title pt-2 pb-2 rounded-3 fs14 fw-medium">
            <span className="main-color">商品類型</span>
            <button
              className="button-clear ps-3 sub-text-color"
              onClick={() => {
                setProductCate('')
              }}
            >
              清除
            </button>
          </div>
          <div className="cate-input">
            {productCateItems.map((item, i) => (
              <div
                className={`d-flex gap-2 px-2 py-2 m-1 align-items-center rounded-2 fs14 fw-medium sub-text-color text-start rounded-pill`}
                key={i}
              >
                <input
                  className="form-check-input m-0"
                  type="checkbox"
                  id={`productCate${i}`}
                  checked={
                    paramsProductCate
                      ? paramsProductCate.includes(i + 1)
                      : productCate.includes(i + 1)
                  }
                  onChange={() => {
                    const newProductCate = productCate.includes(i + 1)
                      ? productCate.filter((c) => c !== i + 1)
                      : [...productCate, i + 1]
                    setProductCate(newProductCate)
                  }}
                />
                <label className="form-check-label" htmlFor={`productCate${i}`}>
                  {item}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="cate ps-1">
          <div className="cate-title pt-2 pb-2 rounded-3 fs14 fw-medium">
            <span className="main-color">文章類型</span>
            <button
              className="button-clear ps-3 sub-text-color"
              onClick={() => {
                setPostCate('')
              }}
            >
              清除
            </button>
          </div>
          <div className="cate-input">
            {postCateItems.map((item, i) => (
              <div
                className={`d-flex gap-2 px-2 py-2 m-1 align-items-center rounded-2 fs14 fw-medium sub-text-color text-start rounded-pill ${postCate.includes(i + 1) ? 'active' : ''}`}
                key={i}
              >
                <input
                  className="form-check-input m-0"
                  type="checkbox"
                  id={`postCate${i}`}
                  checked={postCate.includes(i + 1)}
                  onChange={() => {
                    const newPostCate = postCate.includes(i + 1)
                      ? postCate.filter((c) => c !== i + 1)
                      : [...postCate, i + 1]
                    setPostCate(newPostCate)
                  }}
                />
                <label className="form-check-label" htmlFor={`postCate${i}`}>
                  {item}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div
          className={`reset-filter d-flex ${!keyword & !productCate & !postCate ? 'hidden' : ''}`}
        >
          <button
            className={`ps-1 sub-text-color button-clear py-2 fs14`}
            onClick={(e) => {
              handleKeywordSearch(e, 'clear')
              setProductCate('')
              setPostCate('')
              router.push('/forum')
            }}
          >
            清除所有篩選
          </button>
        </div>
      </aside>
    </>
  )
}
