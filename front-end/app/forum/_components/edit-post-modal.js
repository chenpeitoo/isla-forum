'use client'

import { useState, useEffect, useRef } from 'react'
import ComponentsAuthorInfo from './author-info'
import { useAuth } from '../../../hook/use-auth'
import { useFilter } from '../_context/filterContext'
import { useRouter } from 'next/navigation'
import UseImg from '../_hooks/useImg'
import GetPosts from '../_hooks/getPosts'
import Ripples from 'react-ripples'
import { toast } from 'react-toastify'
// import '/bootstrap/dist/js/bootstrap.bundle.min.js' 無法直接引入

export default function EditPostModal({
  postID = '',
  productCate = '',
  postCate = '',
  postTitle = '',
  postContent = '',
  isUpdated = false,
  mutateDetail = () => {},
}) {
  const modalRef = useRef()
  const router = useRouter()
  const { user, isAuth } = useAuth()
  const userID = user.id
  const userUrl = user.ava_url
  const userNick = user.nickname

  const { productCateItems, postCateItems } = useFilter()
  const { mutate } = GetPosts('tab=2') //因為新增貼文後會導向tab=2，保持key一致才能成功mutate

  useEffect(() => {
    titleRef.current.innerText = postTitle
    contentRef.current.innerHTML = postContent
    setTitleValid(true)
    // setContentValid(true)
  }, [postTitle, postContent])

  const productCateRef = useRef()
  const postCateRef = useRef()
  const titleRef = useRef()
  const contentRef = useRef()

  // // 類別預設值
  // useEffect(() => {
  //   productCateRef.current.value = productCate
  //   postCateRef.current.value = postCate
  // }, [])

  const { handleImgUpload } = UseImg()

  // 提交表單
  const handleSubmit = async (e) => {
    console.log('handleSubmit')
    // e.preventDefault()
    const productCate = productCateRef.current.value
    const postCate = postCateRef.current.value
    // console.log({ productCate, postCate })
    const title = titleRef.current.innerHTML.trim() //QU WHY trim
    const content = contentRef.current.innerHTML.trim()
    if (title === '' || title === '<br>') {
      // QU 怎麼精簡判斷式
      console.log('請輸入標題')
      console.log(title)
      return
    } else if (content === '' || content === '<br>') {
      console.log('請輸入內容')
      return
    }

    const fd = new FormData()
    fd.append('postID', postID)
    fd.append('productCate', productCate)
    fd.append('postCate', postCate)
    fd.append('title', title) //fd長怎樣QU
    fd.append('content', content)
    fd.append('userID', userID)
    const method = isUpdated ? 'PUT' : 'POST'

    // 建立還是更新
    fetch('http://localhost:3005/api/forum/posts', {
      method: method,
      body: fd,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`錯誤: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        // console.log(data)
        if (isUpdated) {
          mutateDetail()
          router.push(`/forum/${postID}`)
          toast.info('已成功編輯貼文')
        } else {
          mutate()
          router.push('/forum?tab=2')
          toast.info('已成功發佈貼文')
        }
        setHasTitleTouched(false)
        setTitleValid(false)
        setContentValid(false)

        titleRef.current.innerText = ''
        contentRef.current.innerText = ''
      })
      .catch((err) => {
        console.log(err)
        toast.error('上傳錯誤，請重新試試')
      })
  }
  // 字數
  const [titleLength, setTitleLength] = useState(0)
  const [isTitleValid, setTitleValid] = useState(false)
  const [hasTitleTouched, setHasTitleTouched] = useState(false)
  const [isContentValid, setContentValid] = useState(false)

  const btnSubmitClass =
    isTitleValid && isContentValid
      ? 'bg-main color-isla-white'
      : 'bg-hover-gray sub-text-color'

  // console.log({ isUpdated })
  // console.log({ isTitleValid, isContentValid, hasTitleTouched })
  return (
    <>
      <form>
        {/* <button onClick={mutate}>mutate</button> */}
        <div
          className="modal fade"
          // id="editPostModal"
          id={isUpdated ? 'updatedPostModal' : 'editPostModal'}
          ref={modalRef}
          tabIndex={-1}
          aria-labelledby="editPostModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable modal-forum">
            <div className="modal-content bg-pure-white">
              <div className="modal-header main-color py-2">
                <h5
                  className="modal-title main-text-color fs20"
                  id="editPostModalLabel"
                >
                  建立貼文
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-info px-4 pt-2 d-flex gap-3">
                <ComponentsAuthorInfo
                  authorID={userID}
                  width="40"
                  src={userUrl}
                  alt={userNick}
                  fontSize="15"
                  color="var(--main-text-color)"
                  authorName={userNick}
                />
                <div className="selects d-flex w-auto gap-2 py-2">
                  <select
                    ref={productCateRef}
                    className="form-select form-select-sm w-auto rounded-pill"
                    aria-label="Small select example"
                    defaultValue={isUpdated ? productCate : 1}
                  >
                    {/* FIXME 產品類型不可點選、警告 */}
                    <option disabled>產品類型</option>
                    {productCateItems.map((v, i) => {
                      return (
                        <option key={i} value={i + 1}>
                          {v}
                        </option>
                      )
                    })}
                  </select>
                  <select
                    ref={postCateRef}
                    className="form-select form-select-sm w-auto rounded-pill"
                    aria-label="Small select example"
                    defaultValue={isUpdated ? postCate : 1}
                  >
                    <option disabled>文章類型</option>
                    {postCateItems.map((v, i) => {
                      return (
                        <option key={i} value={i + 1}>
                          {v}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
              <div className="modal-body d-flex flex-column w-100">
                <div className="d-flex align-items-center px-4 py-2">
                  <div
                    // QU 避免標題換行、第一行沒有div包裹
                    ref={titleRef}
                    className="edit-title main-text-color fs20 me-auto text-wrap w-100"
                    contentEditable
                    data-placeholder="輸入文章標題"
                    // dangerouslySetInnerHTML={{ __html: postTitle }} 不能修改
                    onInput={(e) => {
                      // 沒有trim的話會剩下，可能殘留<br>
                      const titleLength = e.target.innerText.trim().length
                      setTitleLength(titleLength)
                      setHasTitleTouched(true)
                      // console.log(titleLength)
                      titleLength <= 50 && titleLength > 0
                        ? setTitleValid(true)
                        : setTitleValid(false)
                    }}
                    onPaste={(e) => {
                      e.preventDefault()
                      const text = e.clipboardData.getData('text/plain') //防止複製貼上鬼東西
                      document.execCommand('insertText', false, text)
                    }}
                  >
                    {/* {isUpdated && postTitle} */}
                  </div>
                </div>
                <div
                  className={`fs14 sub-text-color px-4 ${!isTitleValid && hasTitleTouched ? 'titleError' : ''} `}
                  error-persudo={
                    titleLength > 50
                      ? '標題已超過字數上限'
                      : titleLength === 0
                        ? `請輸入標題`
                        : ''
                  }
                >{`(${titleLength}/50)`}</div>
                <div
                  ref={contentRef}
                  className="edit-area px-4 py-2 flex-grow-1 main-text-color"
                  contentEditable
                  data-placeholder="分享你的美妝新發現✨"
                  onInput={(e) => {
                    setContentValid(true)
                    // if (contentlength > 0 && contentlength <= 50) {
                    //   setContentValid(true)
                    // } else {
                    //   setContentValid(false)
                    // }
                  }}
                  onPaste={(e) => {
                    // 防止xss攻擊
                    e.preventDefault()
                    const text = e.clipboardData.getData('text/plain')
                    document.execCommand('insertText', false, text)
                    setContentValid(true)
                  }}
                ></div>
              </div>
              <div className="modal-footer px-4 py-2 gap-1">
                <input
                  name="images"
                  type="file"
                  id="uploadImage"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => {
                    handleImgUpload(e, userID, contentRef, modalRef)
                  }}
                />
                <label
                  htmlFor="uploadImage"
                  className="px-3 py-1 mx-0 my-0 me-auto h-100 bg-hovering-gray rounded-pill"
                >
                  <div
                    role="button"
                    className="d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-image fs32 sub-text-color"></i>
                    <span className="sub-text-color">上傳多張圖片</span>
                  </div>
                </label>
                <button
                  type="button"
                  className="px-3 py-2 rounded-3 sub-text-color button-clear bounce bg-hovering-gray"
                  data-bs-dismiss="modal"
                >
                  取消
                </button>
                <Ripples className="rounded-3">
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className={`px-4 py-2 rounded-3 border-0 bounce
                    ${btnSubmitClass}`}
                    disabled={isTitleValid && isContentValid ? false : true}
                    onClick={(e) => {
                      e.preventDefault()
                      // console.log({
                      //   isTitleValid,
                      //   isContentValid,
                      //   hasTitleTouched,
                      // })
                      handleSubmit(e)
                    }}
                  >
                    發布
                  </button>
                </Ripples>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
