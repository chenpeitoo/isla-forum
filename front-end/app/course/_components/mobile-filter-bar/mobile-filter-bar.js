// components/MobileFilterBar.js
'use client'

import { MdSearch } from 'react-icons/md'
import './mobile-filter-bar.css'

export default function MobileFilterBar({
  searchTerm = '',
  setSearchTerm = '',
  showFilter = '',
  setShowFilter = '',
  sortOption = '',
  setSortOption = '',
  showExperienceOnly = '',
  setShowExperienceOnly = '',
  selectedCategory = 0,
  setSelectedCategory = 0,
  fixedCategories = [],
}) {
  return (
    <div className="search-sticky-bar sticky-bar-style d-lg-none w-100">
      {/* 篩選按鈕 */}
      <div className="d-flex justify-content-between align-items-center px-3">
        <button
          className="text-center w-100 py-2 search-sticky-filter border-0 bg-transparent d-flex justify-content-center align-items-center gap-1"
          type="button"
          onClick={() => setShowFilter(!showFilter)}
        >
          篩選 <i className={`bx bx-chevron-${showFilter ? 'up' : 'down'}`} />
        </button>
      </div>

      {/* 搜尋欄 */}
      <div className="d-flex justify-content-between align-items-center px-3 position-relative">
        <div className="py-3 text-center w-100">
          <input
            type="text"
            className="form-control ps-5"
            placeholder="想學新技巧？搜尋課程、老師、彩妝體驗通通有！"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MdSearch className="position-absolute search-icon-m" />
        </div>
      </div>

      {/* 篩選內容 */}
      <div
        className={`px-3 animated-collapse ${showFilter ? 'open' : ''}`}
        id="filterCollapse"
      >
        <div className="py-3">
          <p className="mb-1 fw-bold">排序-由高到低</p>
          <ul
            className="nav nav-pills d-flex justify-content-start"
            id="pills-tab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link search-btn ${sortOption === '1' ? 'active' : ''}`}
                type="button"
                onClick={() => setSortOption('1')}
              >
                最熱門
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link search-btn ${sortOption === '2' ? 'active' : ''}`}
                type="button"
                onClick={() => setSortOption('2')}
              >
                依評價
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link search-btn ${sortOption === '3' ? 'active' : ''}`}
                type="button"
                onClick={() => setSortOption('3')}
              >
                依時間
              </button>
            </li>
          </ul>

          <hr />

          <p className="mb-1 fw-bold">狀態</p>
          <div className="form-check form-switch py-2">
            <input
              className="form-check-input rounded-pill search-btn1"
              type="checkbox"
              id="mobileExperienceSwitch"
              checked={!!showExperienceOnly}
              onChange={() => setShowExperienceOnly((prev) => !prev)}
            />
            <label
              className="form-check-label search-btntext"
              htmlFor="mobileExperienceSwitch"
            >
              只顯示彩妝體驗
            </label>
          </div>

          <p className="mb-1 fw-bold">類別</p>
          <div className="d-flex overflow-auto gap-2">
            <button
              className={`btn p-1 nav-link search-btn ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              所有課程
            </button>
            {fixedCategories.map((cat) => (
              <button
                key={cat.id}
                className={`btn p-1 nav-link search-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
