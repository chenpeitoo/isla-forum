export default function AsideCourse({
  courseCategory = '',
  setCourseCategory = '',
}) {
  const courses = ['韓式彩妝', '專業彩妝', '日常彩妝', '其他課程']

  return (
    <aside className="d-none d-md-block col-lg-3 col-md-4 ps-0 mt-0">
      <div className="position-sticky pt-2 px-3">
        <section className="mb-4">
          <h5 className="aside-title">課程</h5>
          <ul className="nav flex-column">
            {courses.map((course, i) => (
              <li key={i} className="nav-item">
                <a
                  href="#"
                  className={`aside-link nav-link px-2 py-2 fs-5 ${courseCategory === course ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setCourseCategory(courseCategory === course ? '' : course)
                  }}
                >
                  {course}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  )
}
