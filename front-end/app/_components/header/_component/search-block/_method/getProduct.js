export default async function getProduct(search = '') {
  if (search === '') return []
  let error = ''
  const products = await fetch('http://localhost:3005/api/products/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ keyword: search }),
  })
    .then(async (data) => await data.json())
    .then((data) => data['data'])
    .catch((err) => {
      error = err
      return []
    })

  if (error) {
    console.log('getProduct error', error)
    return [{ title: '', productImg: '', price: '', brand: '' }]
  }

  return products.map((product) => {
    return {
      title: product?.title,
      productImg: product?.productImg,
      product_id: product?.product_id,
      price: product?.final_price,
      brand: product?.brand,
    }
  })
}
