import './_styles/style.css'
import SideBar from './_component/side-bar'
export default function MemberLayout({ children }) {
  return (
    <>
      <div className="container container-user mx-auto">
        <div className="flex">
          {/* siderBar also check is there user login */}
          <SideBar />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  )
}
