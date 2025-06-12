'use client'

import { useState, useRef } from 'react'
import { useFilter } from '../_context/filterContext'

export default function ComponentsSearchBar({
  postCateItems = [],
  productCateItems = [],
  handleAsideSearchChange = () => {},
}) {
  // const router = useRouter()
  const {
    setKeyword,
    keyword,
    setProductCate,
    productCate,
    setPostCate,
    postCate,
  } = useFilter()
  const keywordInputRef = useRef()
  const [isSearchEmpty, setSearchEmpty] = useState(true)

  return (
    <>
      <aside className="aside d-flex flex-column pt-2 position-sticky">
        <form action="http://localhost:3005/api/forum/posts">
          <div className="search-bar d-flex flex-row align-items-center bottom-stroke">
            <button
              className="d-inline-block button-clear sub-text-color me-2"
              onClick={(e) => {
                e.preventDefault()
                const inputKeyword = keywordInputRef.current.value
                if (!isSearchEmpty) {
                  setKeyword(inputKeyword)
                  handleAsideSearchChange(inputKeyword, productCate, postCate)
                  // keywordInputRef.current.value = ''
                  setSearchEmpty(true)
                }
              }}
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
                  setSearchEmpty(false)
                }}
                onKeyDown={(e) => {
                  const inputKeyword = keywordInputRef.current.value.trim()
                  if (
                    e.key === 'Enter' &&
                    inputKeyword.length !== 0 &&
                    !isSearchEmpty &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault()
                    setKeyword(inputKeyword)
                    handleAsideSearchChange(inputKeyword, productCate, postCate)
                    // FIXME 重複enter搜尋詞不要消失
                    // keywordInputRef.current.value = ''
                    setSearchEmpty(false)
                    e.target.blur()
                  }
                }}
              />
            </div>
            {!isSearchEmpty && (
              <button
                className={`search-clear d-inline-block button-clear sub-text-color pe-1`}
                onClick={(e) => {
                  e.preventDefault()
                  if (keywordInputRef.current.value)
                    keywordInputRef.current.value = ''
                  setKeyword('')
                  handleAsideSearchChange('', productCate, postCate)
                  setSearchEmpty(true)
                }}
              >
                <i className="bi bi-x fs20"></i>
              </button>
            )}
          </div>
          <div
            className={`reset-filter d-flex ${keyword || productCate.length > 0 || postCate.length > 0 ? '' : 'hidden'}`}
          >
            <button
              className={`ps-1 sub-text-color button-clear py-1 fs14`}
              onClick={(e) => {
                e.preventDefault()
                console.log({ keyword, productCate, postCate })
                handleAsideSearchChange('', productCate, postCate)
                setKeyword('')
                setSearchEmpty(true)
                keywordInputRef.current.value = ''
                setProductCate('')
                setPostCate('')
                handleAsideSearchChange('', '', '')
              }}
            >
              清除篩選
            </button>
          </div>
        </form>

        <div className="cate ps-1">
          <div className="cate-title pt-2 pb-2 rounded-3 fs14 fw-medium main-color">
            商品類型
          </div>
          <div className="cate-input">
            {productCateItems.map((item, i) => (
              <div
                className={`d-flex gap-2 px-2 py-2 m-1 align-items-center rounded-2 fs14 fw-medium sub-text-color text-start rounded-pill ${productCate.includes(i + 1) ? 'active' : ''}`}
                key={i}
              >
                <input
                  className="form-check-input m-0"
                  type="checkbox"
                  id={`productCate${i}`}
                  checked={productCate.includes(i + 1)}
                  onChange={(e) => {
                    let newProductCate
                    if (productCate.includes(i + 1)) {
                      newProductCate = productCate.filter((c) => c !== i + 1)
                      setProductCate(newProductCate)
                    } else {
                      newProductCate = [...productCate, i + 1]
                      setProductCate(newProductCate)
                    }
                    handleAsideSearchChange(keyword, newProductCate, postCate)
                    // e.target.blur()
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
          <div className="cate-title pt-4 pb-2 rounded-3 fs14 fw-medium main-color">
            文章類型
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
                  onChange={(e) => {
                    let newPostCate
                    if (postCate.includes(i + 1)) {
                      newPostCate = postCate.filter((c) => c !== i + 1)
                      setPostCate(newPostCate)
                    } else {
                      newPostCate = [...postCate, i + 1]
                      setPostCate(newPostCate)
                    }
                    handleAsideSearchChange(keyword, productCate, newPostCate)
                    // e.target.blur()
                  }}
                />
                <label className="form-check-label" htmlFor={`postCate${i}`}>
                  {item}
                </label>
              </div>
            ))}
          </div>
        </div>
      </aside>
      {/* </div> */}
    </>
  )
}
