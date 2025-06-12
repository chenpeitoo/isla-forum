'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { courseUrl } from '@/_route/courseUrl' // API 路由常數
import CourseCard from '@/app/course/_components/course-card/course-card'
import ExperienceCard from '@/app/course/_components/experience-card/experience-card' // 體驗卡片元件
import Componentstab from '../../tab'

export default function CourseSection(props) {
  const [courseCard, setCourseCard] = useState([]) // 課程資料
  const [experienceCard, setExperienceCard] = useState([]) // 體驗資料
  const [tabSwitch, setTabSwitch] = useState(1)
  // console.log('tabSwitch ', tabSwitch)
  const recommendedCourseIds = [1, 7, 8, 19]

  useEffect(() => {
    async function getCourse() {
      const res = await fetch(courseUrl + 'course') // 撈取課程資料
      const json = await res.json()
      setCourseCard(json.data || [])

      const resexp = await fetch(courseUrl + 'experience') // 撈取體驗資料
      const jsonexp = await resexp.json()
      setExperienceCard(jsonexp.data || [])
    }
    getCourse()
  }, [])

  return (
    <>
      <div className="d-flex flex-column align-items-center">
        <div className="d-flex flex-column align-items-center gap-4">
          <h3>美妝課程</h3>
          <Componentstab
            cates={['線上課程', '彩妝體驗']}
            handleTabChange={setTabSwitch}
          />
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-lg-4 g-4 p-0 m-0 mt-4">
          {tabSwitch === 1 &&
            courseCard
              .filter((v) => recommendedCourseIds.includes(v.id))
              .map((v, i) => {
                return (
                  <CourseCard
                    key={i}
                    id={v.id}
                    picture={'/images/course/bannerall/' + v.picture}
                    tag={v.tag}
                    title={v.title}
                    teacher_name={v.teacher_name}
                    teacher={v.teacher}
                    student={v.student}
                    price={v.price}
                    discount={v.discount}
                    avg_star={v.avg_star}
                    comment_count={v.comment_count}
                  />
                )
              })}
          {tabSwitch === 2 &&
            experienceCard.slice(0, 4).map((v, i) => {
              return (
                <ExperienceCard
                  key={i}
                  id={v.id}
                  picture={'/images/course/bannerall/' + v.picture}
                  tag={v.tag}
                  title={v.title}
                  city={v.city}
                  activity_data={v.activity_data}
                  price={v.price}
                  discount={v.discount}
                />
              )
            })}
        </div>
        <Link href="/course">
          <button className="btn btn-primary">查看更多</button>
        </Link>
      </div>
    </>
  )
}
