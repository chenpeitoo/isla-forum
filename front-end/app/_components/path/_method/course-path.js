export async function getCoursePath(thisPath) {
  let error = ''
  // ==== 取得課程標題 ====
  const response = await fetch(
    `http://localhost:3005/api/course/course-list/${thisPath}`
  ).catch((err) => {
    error = err?.message || err
    return ''
  })

  if (error) {
    console.log('path error: ', error)
    return response
  }

  const data = await response.json()
  // console.log(data['data'][0].title)
  const courseTit = data.data.title || ''
  console.log('courseTit', courseTit)
  return courseTit
}

export async function getExperiencePath(thisPath) {
  let error = ''
  // ==== 取得課程標題 ====
  const response = await fetch(
    `http://localhost:3005/api/course/experience-list/${thisPath}`
  ).catch((err) => {
    error = err?.message || err
    return ''
  })

  if (error) {
    console.log('path error: ', error)
    return response
  }

  const data = await response.json()
  // console.log(data['data'][0].title)
  const courseTit = data['data'][0].title || ''
  console.log('courseTit', courseTit)
  return courseTit
}

export async function getTeacherPath(thisPath) {
  let error = ''
  // ==== 取得課程標題 ====
  const response = await fetch(
    `http://localhost:3005/api/course/teacher-list/${thisPath}`
  ).catch((err) => {
    error = err?.message || err
    return ''
  })

  if (error) {
    console.log('path error: ', error)
    return response
  }

  const data = await response.json()
  console.log(data['data'])
  const courseTit = data['data'].users_name || ''
  console.log('courseTit', courseTit)
  return courseTit
}
