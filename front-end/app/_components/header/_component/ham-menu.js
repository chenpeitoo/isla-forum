'use client'

// import React, { useState } from 'react'

export default function HamMenu({
  hamMenuOpen = false,
  setHamMenuOpen = () => {},
}) {
  const isActive = hamMenuOpen ? 'active' : ''
  return (
    <>
      <button
        className={'d-lg-none d-block ham-menu' + ' ' + isActive}
        onClick={() => {
          setHamMenuOpen(!hamMenuOpen)
        }}
      >
        <span />
        <span />
        <span />
      </button>
    </>
  )
}
