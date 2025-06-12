'use client'
import { Modal } from 'react-bootstrap'
import Link from 'next/link'

export default function LoginModal({ show, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>請先登入</Modal.Title>
      </Modal.Header>
      <Modal.Body>您需要登入才能領取優惠券。</Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>
          取消
        </button>
        <Link href="/member/login" className="btn btn-primary">
          前往登入
        </Link>
      </Modal.Footer>
    </Modal>
  )
}
