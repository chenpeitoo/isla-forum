import ProductCardColorDots from './product-card-color-dots'
import ProductCardCourse from './product-card-course'
import ProductCardNormal from './product-card-normal'
// import ProductCardAddon from './product-card-addon'
// import ProductCardDropdown from './product-card-dropdown'

export default function ProductCard({ type, ...props }) {
  switch (type) {
    case 'colorDots':
      return <ProductCardColorDots {...props} />

    case 'course':
      return <ProductCardCourse {...props} />

    case 'normal':
      return <ProductCardNormal {...props} />

    // case 'addon':
    //   return <ProductCardAddon {...props} />

    // case 'dropDown':
    //   return <ProductCardDropdown {...props} />

    default:
      return <div>沒有這個樣式的卡片</div>
  }
}
