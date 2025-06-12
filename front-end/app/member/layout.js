import './_styles/style.css'
import SideBar from './_component/side-bar'
export default function MemberLayout({ children }) {
  return (
    <>
      <div className="container container-user">
        <div className="row justify-content-center">
          {/* siderBar also check is there user login */}
          <SideBar />
          {/* main-content */}
          <div className="col-lg-9 col-12">{children}</div>
        </div>
      </div>
    </>
  )
}
