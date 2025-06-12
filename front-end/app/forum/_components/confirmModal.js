'use client'

import React, { useState, useEffect } from 'react'

export default function ConfirmModal({
  title = '',
  content = '',
  confirm = '',
  cancel = '',
  handleModalAction = () => {},
  param = null,
}) {
  return (
    <>
      <div
        className="modal fade modal-confirm"
        id="confirmModal"
        tabIndex={-1}
        aria-labelledby="ConfirmLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-sm mtHeader">
          <div className="modal-content bg-pure-white">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="ConfirmLabel">
                {title}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              />
            </div>
            <div className="modal-body">{content}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel px-3 py-2 rounded-3 button-clear sub-text-color bg-hovering-gray"
                data-bs-dismiss="modal"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                {cancel}
              </button>
              <button
                type="button"
                className="btn-submit px-3 py-2 border-0 rounded-3 color-isla-white"
                data-bs-dismiss="modal"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleModalAction(param)
                }}
              >
                {confirm}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
