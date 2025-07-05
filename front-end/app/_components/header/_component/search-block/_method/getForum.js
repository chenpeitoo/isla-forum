export default async function getForum(search = '') {
  if (search === '') return []
  let error = ''
  const forums = await fetch(
    'http://localhost:3005/api/forum/posts/header-search',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword: search }),
    }
  )
    .then(async (data) => await data.json())
    .then((data) => data['data'])
    .catch((err) => {
      error = err

      return []
    })
  if (error) {
    console.log('getForum error', error)
    return [{ title: '', nickname: '', ava_img: '', catName: '' }]
  }
  return forums.map((forum) => {
    return {
      id: forum.id,
      title: forum.title,
      nickname: forum.user_nick,
      ava_img: forum.user_img,
      catName: forum.cate_name,
      content: forum.content,
    }
  })
}
