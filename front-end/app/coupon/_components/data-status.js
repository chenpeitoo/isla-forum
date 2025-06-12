import LoadingLottie from '../../_components/loading/lottie-loading'

export default function DataStatus({
  isLoading,
  isError,
  isEmpty = false,
  message = '',
  errorMessage = '',
}) {
  // 載入中
  if (isLoading) {
    return (
      <div className="text-center py-5 sub-text fs-5">
        {/* <div className="mb-2">🔄</div>
        載入中... */}
        <LoadingLottie />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-5 sub-text fs-5">
        <div className="mb-3 d-flex justify-content-center mt-5">
          <LoadingLottie />
        </div>
        {errorMessage}
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="text-center py-5 sub-text fs-5">
        <div className="mb-3 d-flex justify-content-center mt-5-2">
          <LoadingLottie />
        </div>
        {message}
      </div>
    )
  }

  return null
}
