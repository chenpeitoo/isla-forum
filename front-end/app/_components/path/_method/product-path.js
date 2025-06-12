export async function getProductPath(thisPath) {
  let error = ''
  // ==== 取得課程標題 ====
  const response = await fetch(
    `http://localhost:3005/api/product/bread/${thisPath}`
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
  const productTit = data.data.name || '商品詳細'
  console.log('productTit', productTit)
  return productTit
}
