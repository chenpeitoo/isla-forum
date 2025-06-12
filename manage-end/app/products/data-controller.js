'use client'

import { useProductManageList } from '@/hook/use-product-manage.js'

// Initial mock data
let mockProductsData = [
  {
    id: 1,
    name: '保濕精華液',
    category: '精華液',
    brand: 'ISLA',
    price: 1280,
    stock: 45,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
    ], // Now an array
    description:
      '深層保濕，適合乾性肌膚使用。採用天然成分，溫和無刺激，能有效鎖住肌膚水分，改善乾燥粗糙，使肌膚水潤飽滿。',
    updatedAt: '2024-01-20',
    sale_price: null, // New field
    sale_start_date: null, // New field (e.g., "2025-06-01")
    sale_end_date: null, // New field (e.g., "2025-06-15")
  },
  {
    id: 2,
    name: '溫和潔面乳',
    category: '潔面',
    brand: 'ISLA',
    price: 680,
    stock: 23,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
    ],
    description:
      '溫和清潔，不刺激敏感肌膚。泡沫細膩豐富，能深入毛孔清潔污垢和多餘油脂，洗後肌膚清爽不緊繃。',
    updatedAt: '2024-01-18',
    sale_price: 599,
    sale_start_date: '2025-05-20',
    sale_end_date: '2025-06-05',
  },
  {
    id: 3,
    name: '防曬乳霜 SPF50',
    category: '防曬',
    brand: 'ISLA',
    price: 950,
    stock: 0,
    status: 'inactive',
    images: [
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&h=300&fit=crop',
    ],
    description:
      '高效防曬，適合戶外活動使用。質地輕薄透氣，防水防汗，能有效抵禦UVA和UVB傷害，預防曬傷曬黑。',
    updatedAt: '2024-01-22',
    sale_price: null,
    sale_start_date: null,
    sale_end_date: null,
  },
  {
    id: 4,
    name: '抗老化面霜',
    category: '面霜',
    brand: 'ISLA',
    price: 1680,
    stock: 12,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1620916290199-131ef006947a?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1580893207843-5c960035f501?w=300&h=300&fit=crop',
    ],
    description:
      '減少細紋，緊緻肌膚。富含多種抗衰老成分，能促進膠原蛋白生成，提升肌膚彈性，淡化皺紋。',
    updatedAt: '2024-01-19',
    sale_price: null,
    sale_start_date: null,
    sale_end_date: null,
  },
  {
    id: 5,
    name: '維生素C精華',
    category: '精華液',
    brand: 'ISLA',
    price: 1450,
    stock: 31,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1605992584289-25018f6e7129?w=300&h=300&fit=crop',
    ],
    description:
      '美白亮膚，抗氧化。高濃度維生素C成分，能有效抑制黑色素生成，提亮膚色，改善暗沉，同時抵抗自由基侵害。',
    updatedAt: '2024-01-21',
    sale_price: 1299,
    sale_start_date: '2025-06-01',
    sale_end_date: '2025-06-30',
  },
]

export const getProducts = () => {
  const { products, loading, productError } = useProductManageList()
  if (loading) {
    return (
      <>
        <h1>載入中</h1>
      </>
    )
  }
  if (productError) {
    return (
      <>
        <h1>ERROR: {productError.message}</h1>
      </>
    )
  }
  return [...products]
}
export const getMockProducts = () => {
  return [...mockProductsData]
}

const updateProductMutation = useMutation({
  mutationFn: updateProductAPI, // 這是你用來送資料到 API 的函式
  onSuccess: () => {
    queryClient.invalidateQueries(['products']) // 重新取得最新產品列表
  },
})

const updateProduct = (updatedProduct) => {
  updateProductMutation.mutate({
    ...updatedProduct,
    images: Array.isArray(updatedProduct.images) ? updatedProduct.images : [],
    sale_price: updatedProduct.sale_price ?? null,
    sale_start_date: updatedProduct.sale_start_date ?? null,
    sale_end_date: updatedProduct.sale_end_date ?? null,
    updatedAt: new Date().toISOString().split('T')[0],
  })
}

export const updateProductbak = (updatedProduct) => {
  const index = useProductManageList.findIndex(
    (product) => product.id === updatedProduct.product_id
  )
  if (index !== -1) {
    // Ensure all fields are present even if null, especially new ones
    useProductManageList[index] = {
      ...mockProductsData[index], // old data
      ...updatedProduct, // new data from form
      images: updatedProduct.images || [], // ensure images is an array
      sale_price:
        updatedProduct.sale_price !== undefined
          ? updatedProduct.sale_price
          : null,
      sale_start_date:
        updatedProduct.sale_start_date !== undefined
          ? updatedProduct.sale_start_date
          : null,
      sale_end_date:
        updatedProduct.sale_end_date !== undefined
          ? updatedProduct.sale_end_date
          : null,
      updatedAt: new Date().toISOString().split('T')[0],
    }
    return true
  }
  return false
}

export const addProduct = (newProduct) => {
  const newId =
    mockProductsData.length > 0
      ? Math.max(...mockProductsData.map((p) => p.id)) + 1
      : 1
  const productToAdd = {
    id: newId,
    name: newProduct.name || '未命名商品',
    category: newProduct.category || '未分類',
    brand: newProduct.brand || '未知品牌',
    price: parseFloat(newProduct.price) || 0,
    stock: parseInt(newProduct.stock) || 0,
    status: newProduct.status || 'inactive',
    images: newProduct.images || [],
    description: newProduct.description || '',
    updatedAt: new Date().toISOString().split('T')[0],
    sale_price:
      newProduct.sale_price !== undefined ? newProduct.sale_price : null,
    sale_start_date:
      newProduct.sale_start_date !== undefined
        ? newProduct.sale_start_date
        : null,
    sale_end_date:
      newProduct.sale_end_date !== undefined ? newProduct.sale_end_date : null,
  }
  mockProductsData.push(productToAdd)
  return productToAdd
}
