'use client'

import React, { useState, useEffect, useRef } from 'react'

export default function EditPostModal(props) {
  const modalRef = useRef()
  // useEffect(() => {
  //   import('bootstrap/dist/js/bootstrap.bundle.min.js').then((bootstrap) => {
  //     document
  //       .querySelectorAll('[data-bs-toggle="tooltip"]')
  //       .forEach((el) => new bootstrap.Tooltip(el))

  //     const modalEl = modalRef.current
  //     if (modalEl) {
  //       new bootstrap.Modal(modalEl, {
  //         backdrop: true,
  //         keyboard: true,
  //       })
  //     }
  //   })
  // }, [])
  return (
    <>
      <form action="">
        <div
          className="modal fade"
          id="editPostModal"
          ref={modalRef}
          tabIndex={-1}
          aria-labelledby="editPostModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable modal-forum">
            <div className="modal-content bg-pure-white">
              <div className="modal-header main-color">
                <h5
                  className="modal-title main-text-color fs20"
                  id="editPostModalLabel"
                >
                  新增貼文
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div
                  className="edit-area"
                  contentEditable="true"
                  data-placeholder="分享你的美妝新發現✨"
                ></div>
              </div>
              <div className="px-4 py-3 modal-footer">
                <button className="mx-0 my-0 me-auto h-100">
                  <i className="bi bi-image fs32 sub-text-color"></i>
                </button>
                <button
                  type="button button-clear"
                  className="sub-text-color"
                  data-bs-dismiss="modal"
                >
                  取消
                </button>
                <button
                  type="button-bounce button-clear"
                  className="px-4 py-2 bg-main color-isla-white rounded-3"
                >
                  發布
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
