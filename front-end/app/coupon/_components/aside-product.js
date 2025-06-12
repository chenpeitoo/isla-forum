export default function AsideProduct({
  currentBrand = '',
  setCurrentBrand = '',
  productCategory = '',
  setProductCategory = '',
}) {
  const brands = [
    'Unleashia',
    'Cosnori',
    'Muzigae Mansion',
    'Kaja',
    'rom&nd',
    "A'Pieu",
  ]
  const categories = ['眼部彩妝', '唇部彩妝', '臉頰彩妝', '眉部彩妝', '底妝']

  return (
    <aside className="d-none d-md-block col-lg-3 col-md-4 ps-0 mt-0">
      <div className="position-sticky pt-2 px-3">
        <section className="mb-4">
          <h5 className="aside-title">品牌</h5>
          <ul className="nav flex-column">
            {brands.map((brand, i) => (
              <li key={i} className="nav-item">
                <a
                  href="#"
                  className={`aside-link nav-link px-2 py-2 fs-5 ${currentBrand === brand ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentBrand(currentBrand === brand ? '' : brand)
                  }}
                >
                  {brand}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h5 className="aside-title">種類</h5>
          <ul className="nav flex-column">
            {categories.map((type, i) => (
              <li key={i} className="nav-item">
                <a
                  href="#"
                  className={`aside-link nav-link px-2 py-2 fs-5 ${productCategory === type ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setProductCategory(productCategory === type ? '' : type)
                  }}
                >
                  {type}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  )
}
