import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import styles from './review_card.module.css'
import StarRatingItem from '../../../_components/star-generator.js'
import Image from 'next/image'
import Modal from 'react-bootstrap/Modal'

import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

const MAX_LENGTH = 120

const ReviewCard = ({ review }) => {
  const {
    userAvatar,
    nickname,
    userId,
    rating,
    images = [],
    comment_text,
    color_name,
    color_code,
    created_at,
  } = review

  const [showModal, setShowModal] = useState(false)

  const isLongComment = comment_text.length > MAX_LENGTH
  const shortComment = isLongComment
    ? comment_text.slice(0, MAX_LENGTH) + '...'
    : comment_text

  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const openLightboxAt = (index) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }
  console.log(color_code)
  return (
    <>
      <div className={styles['comment-card']}>
        <div className={styles['comment-card-head']}>
          <div className={styles['comment-card-head-right']}>
            <div className={styles['card-user-img']}>
              <Image
                className="user-img"
                src={userAvatar}
                alt="UserPicture"
                width={1}
                height={1}
              />
            </div>
            <div className={styles['card-head-user']}>
              <div className={styles['username-card']}>{nickname}</div>
              <div className={styles['user-rating']}>
                <StarRatingItem star={rating} maxStars={5} />
              </div>
              <div className={styles['post-and-color-box']}>
                <div className={styles['post-date']}>
                  {new Date(created_at).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })}
                </div>
                {color_name !== '標準色' && (
                  <div
                    className={`${styles['color-name-card']} ${color_code ? styles['color-name-card-has-color'] : ''}`}
                    style={
                      color_code
                        ? { backgroundColor: color_code, color: '#ffffff' }
                        : { backgroundColor: '#FBFBFB' }
                    }
                  >
                    顏色：{color_name}
                  </div>
                )}
              </div>
            </div>
          </div>
          {images.length > 0 && (
            <div className={styles['comment-card-head-left']}>
              <div className={styles['comment-images-container']}>
                {images.map((imgSrc, index) => (
                  <div
                    key={index}
                    className={styles['comment-image-box']}
                    onClick={() => openLightboxAt(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Image
                      className="img-fluid"
                      src={imgSrc}
                      alt={`Comment Picture`}
                      width={10}
                      height={10}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={clsx(styles['comment-card-body'], 'w-100')}>
          <div className={styles['card-context']}>{shortComment}</div>
        </div>

        {isLongComment && (
          <div className={clsx(styles['comment-card-footer'], 'w-100')}>
            <button
              className={styles['card_show_more']}
              type="button"
              onClick={() => setShowModal(true)}
            >
              查看完整留言
            </button>
          </div>
        )}
      </div>

      {/*{showModal && (*/}
      {/*  <Modal onClose={closeModal}>*/}
      {/*    <div className={styles['full-comment']}>{comment_text}</div>*/}
      {/*  </Modal>*/}
      {/*)}*/}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
        aria-labelledby={`reviewModal-${userId}`}
        dialogClassName={styles['custom-modal-dialog']}
        contentClassName={styles['custom-modal-content']}
      >
        <Modal.Header closeButton>
          <Modal.Title
            className={styles['custom-modal-title']}
            id={`reviewModal-${userId}`}
          >
            {userId} 的留言內容
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles['custom-modal-context']}>
          {comment_text}
        </Modal.Body>
      </Modal>

      {/* Lightbox Component */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={currentIndex}
          slides={images.map((imgSrc) => ({ src: imgSrc }))}
        />
      )}
    </>
  )
}

ReviewCard.propTypes = {
  review: PropTypes.shape({
    userAvatarSrc: PropTypes.string,
    userId: PropTypes.string.isRequired,
    rating: PropTypes.oneOf([0, 1, 2, 3, 4, 5]).isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    comment_text: PropTypes.string.isRequired,
    color_name: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
}

ReviewCard.defaultProps = {
  review: {
    userAvatarSrc:
      'https://i.ibb.co/M5VCPJvM/Screenshot-2025-04-15-at-9-30-59-am.png',
    images: [],
  },
}

export default ReviewCard
