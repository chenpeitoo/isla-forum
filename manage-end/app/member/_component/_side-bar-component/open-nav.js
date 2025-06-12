'use client'
// contorll if the panel is opened or closed
export default function OpneNav({ OpenMenu = false, setOpenMenu = () => {} }) {
  return (
    <>
      <button
        className="user-menu-head"
        onClick={() => {
          setOpenMenu(!OpenMenu)
        }}
      >
        會員選單
      </button>
    </>
  )
}
