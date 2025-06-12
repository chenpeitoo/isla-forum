'use client'

import React, { useState, useEffect, useRef } from 'react'
import useSWR from 'swr'
import RecursiveComment from './_components/recursiveComment'
import ComponentsSubCommentToggle from './_components/subCommentToggle'
import { useParams } from 'next/navigation'
import { useAuth } from '../../../hook/use-auth'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function CommentSection({
  setCommentMutate = () => {},
  setLastCommentRef,
}) {
  const commentsSectionRef = useRef()
  const lastCommentRef = useRef()
  const userID = useAuth().user.id
  const postID = useParams().postID
  const { data, isLoading, error, mutate } = useSWR(
    `http://localhost:3005/api/forum/comment?postID=${postID}`,
    fetcher
  )
  useEffect(() => {
    setCommentMutate(() => mutate)
  }, [mutate, setCommentMutate])
  useEffect(() => {
    setLastCommentRef(lastCommentRef)
  }, [lastCommentRef, setLastCommentRef])

  // useEffect(() => {
  //   mainRef?.current?.scrollTo({
  //     top: mainRef.current.scrollHeight,
  //     behavior: 'smooth',
  //   })
  // }, [data])

  if (error) {
    return <>錯誤</>
  }
  if (isLoading) {
    return <>載入中</>
  }

  const comments = data?.data.map((comment) => {
    const time = new Date(comment.updated_at)
    const timeFormat = `${time.getMonth() + 1}月${time.getDate()}日 ${time.getHours()}:${time.getMinutes()}`

    const user_liked_ids = comment.user_liked_ids
      ? comment.user_liked_ids.split(',').map((id) => Number(id))
      : []
    const btnActive = user_liked_ids.includes(userID)
    const btnCount = user_liked_ids.length
    const editActive = comment.user_id === userID

    // key非comment.id (key單純是索引值)
    return { ...comment, timeFormat, btnActive, btnCount, editActive }
  })

  // 食材1:每條留言 - 有id會比較好操作 -> 整理成物件
  //含多個物件的物件，以comment.id為key，comment為value，並新增subComments
  const commentsMap = {}
  comments.forEach((comment) => {
    commentsMap[comment.id] = {
      ...comment,
      subComments: [],
      subCount: 0,
    }
  })

  const commentsTree = []
  comments.forEach((comment) => {
    const currentComment = commentsMap[comment.id]
    if (comment.parent_id) {
      // 如果commentsMap是陣列，這邊就要filter過濾出需要的那筆
      commentsMap[comment.parent_id].subComments.push(currentComment)
      // commentsMap[comment.parent_id].subCount += currentComment.subCount
      commentsMap[comment.parent_id].subCount += 1
    } else {
      commentsTree.push(currentComment)
    }
    // 函式目標：回傳子留言陣列的長度
    function countSub(comment) {
      if (comment.length === 0) {
        comment.subCount = 0
        return 0
      }
      let count = 0
      comment.subComments.forEach((c) => {
        count += 1 + countSub(c)
      })
      comment.subCount = count
      return count
    }
    commentsTree.forEach((c) => {
      countSub(c)
    })
  })

  // const totalSubCount = subCount()
  // console.log(totalSubCount)

  // console.log(commentsMap)
  // console.log(commentsTree)
  // console.log(commentsTree[0].subComments[0].subComments.length ?? '0')
  console.log(commentsTree)

  return (
    <>
      <div className="comments-section mx-4" ref={commentsSectionRef}>
        <div className="comments-header py-2 bottom-stroke sub-text-color">
          全部留言
        </div>
        <div className="comment-cards d-flex flex-column px-1 py-1">
          {commentsTree.length === 0 ? (
            <div className="py-2 text-center fst-italic sub-text-color">
              目前無留言
            </div>
          ) : (
            commentsTree.map((comment, i) => {
              {
                /* console.log({ i: i, subComments: comment.subComments }) */
              }
              return (
                <div
                  className="comment-card d-flex flex-column gap-3 py-2 bottom-stroke"
                  ref={i === commentsTree.length - 1 ? lastCommentRef : null}
                  key={i}
                >
                  <RecursiveComment
                    commentID={comment.id}
                    userId={comment.user_id}
                    userImg={comment.user_img}
                    userNick={comment.nick}
                    content={comment.content}
                    updatedAt={comment.timeFormat}
                    btnActive={comment.btnActive}
                    btnCount={comment.btnCount}
                    editActive={comment.editActive}
                    mutate={mutate}
                    subComments={comment.subComments}
                    subCount={comment.subCount}
                  />
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
