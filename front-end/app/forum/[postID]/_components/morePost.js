'use client'

import Link from 'next/link'
import ComponentsBtnLikedSaved from '../../_components/btn-liked-saved'
import ComponentsAuthorInfo from '../../_components/author-info'
import { useEffect } from 'react'

export default function ComponentsMorePost({
  postTitle = '',
  likedUserIDs = [],
  savedUserIDs = [],
  commentCount = '',
  postID = '',
  userID = '',
  authorID = '',
  authorNick = '',
  authorUrl = '',
  mutate = () => {},
}) {
  return (
    <>
      <Link
        className="more-card d-flex align-items-center gap-2 px-3 py-2 main-text-color rounded-4"
        href={`/forum/${postID}`}
        target="_top"
      >
        <div className="more-content d-flex flex-column gap-2 flex-grow-1">
          <div className="more-title text-truncate fw-medium">{postTitle}</div>
          <div className="more-actions d-flex fs14">
            <ComponentsBtnLikedSaved
              type="liked"
              active={likedUserIDs.includes(userID)}
              count={likedUserIDs.length}
              postID={postID}
              userID={userID}
              mutate={mutate}
            />
            <button className="evaluate px-2 py-1 border-0 rounded-3 d-flex align-items-center">
              <i className="bi bi-chat me-1 fs16" />
              {commentCount}
            </button>
            <ComponentsBtnLikedSaved
              type="saved"
              active={savedUserIDs.includes(userID)}
              count={savedUserIDs.length}
              postID={postID}
              userID={userID}
              mutate={mutate}
            />
            <div>
              <div className="author-info d-flex align-items-center gap-2 text-decoration-none h-100 sub-text-color">
                <ComponentsAuthorInfo
                  authorID={authorID}
                  width="20"
                  src={authorUrl}
                  alt={authorNick}
                  fontSize={14}
                  color={'var(--main-text-color)'}
                  authorName={authorNick}
                />
              </div>
            </div>
          </div>
        </div>
        {/* <Image
                    className="more-img object-fit-cover rounded-3"
                    src="./images/7aeeb949-922a-46aa-8f6d-79b7c7134bc8.jpeg"
                    layout="fill"
                  /> */}
      </Link>
    </>
  )
}
