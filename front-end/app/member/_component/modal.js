'use client'
import { Modal } from 'react-bootstrap'
import Link from 'next/link'

export default function TheModal({
  show,
  onClose,
  title,
  content,
  btncls,
  btnsuc,
  btnclsOnclick,
  btnsucOnclick,
  btnsucHref = '/',
}) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{content}</Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={btnclsOnclick}>
          {btncls}
        </button>
        <Link
          href={btnsucHref}
          className="btn btn-primary"
          onClick={btnsucOnclick}
        >
          {btnsuc}
        </Link>
      </Modal.Footer>
    </Modal>
  )
}
