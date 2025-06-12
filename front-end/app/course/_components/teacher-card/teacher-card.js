import Image from 'next/image'
import Link from 'next/link'
import './teacher-card.css'
import { TEACHER_URL } from '@/_route/img-url'

export default function TeacherCard({
  id = '',
  name = '',
  image = '',
  about = '',
}) {
  const imagePath = image
    ? `${image}` // ✅ 用 backtick 模板字串
    : 'default-avatar.jpg'

  return (
    <Link
      href={`/course/teacher/${id}`}
      className="text-decoration-none course-card-animate"
    >
      <div className="card card-hover-teacher">
        <div className="card-img-wrapper-teacher">
          <Image
            src={imagePath}
            className="card-img-teacher"
            alt={name || '課程圖片'}
            width={300}
            height={300}
          />
          <div className="card-img-overlay d-flex flex-column justify-content-end overlay-teacher">
            <h5 className="card-title-teacher">{name}</h5>
            <p className="card-text-teacher">{about}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
