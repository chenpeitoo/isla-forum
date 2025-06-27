'use client'

import './_components/forum.css'
import ComponentsSubNav from './_components/sub-nav'
import { FilterProvider } from './_context/filterContext'
import { Suspense } from 'react'

export default function Layout({ children }) {
  return (
    <FilterProvider>
      <div className="body">
        <div className="container-lg my-container">
          <div className="row justify-content-center">
            <ComponentsSubNav />
            <Suspense>{children}</Suspense>
          </div>
        </div>
      </div>
    </FilterProvider>
  )
}
