export default function MoreButton({ onClick, visible }) {
  if (!visible) return null
  return (
    <div className="text-center my-4">
      <button className="btn btn-more" onClick={onClick}>
        載入更多
      </button>
    </div>
  )
}
