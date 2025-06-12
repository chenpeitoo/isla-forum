import { Accordion } from 'react-bootstrap'
import { useRouter } from 'next/navigation'

// 格式化金額
function formatCurrency(num) {
  const n = Number(num)
  if (isNaN(n)) return '0'
  return `NT$${n.toLocaleString('zh-Hant-TW')}`
}

export default function OrderComplete({ orderData }) {
  const {
    orderId,
    orderDate,
    orderStatus,
    paymentMethod,
    paymentStatus,
    recipient,
    products,
  } = orderData

  const router = useRouter()

  return (
    <section className="container my-5">
      <div className="card p-5 text-center shadow-sm rounded-4">
        {/* 打勾圖示 */}
        <div className="mb-4">
          <div
            className="bg-success-subtle rounded-circle d-inline-flex justify-content-center align-items-center"
            style={{ width: '120px', height: '120px' }}
          >
            <i className="bi bi-check2 h1"></i>
          </div>
        </div>

        {/* 訂單完成訊息 */}
        <h5 className="fw-bold text-secondary mb-2">已收到你的訂單</h5>
        <p className="text-muted small mb-4">
          訂單編號：<span className="fw-bold">{orderId}</span>
        </p>

        {/* 訂單資訊列 */}
        <div className="row text-center mb-4">
          <div className="col-6 col-md-3 mb-2">
            <div className="fw-bold">訂單日期</div>
            <div className="text-muted">{orderDate}</div>
          </div>
          <div className="col-6 col-md-3 mb-2">
            <div className="fw-bold">訂單狀態</div>
            <div style={{ color: 'green' }}>{orderStatus}</div>
          </div>
          <div className="col-6 col-md-3 mb-2">
            <div className="fw-bold">付款方式</div>
            <div className="text-muted">{paymentMethod}</div>
          </div>
          <div className="col-6 col-md-3 mb-2">
            <div className="fw-bold">付款狀態</div>
            <div style={{ color: 'green' }}>{paymentStatus}</div>
          </div>
        </div>

        {/* 收件人與商品資訊 Accordion */}
        <Accordion flush className="text-start mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>收件人資訊</Accordion.Header>
            <Accordion.Body style={{ paddingBottom: 0 }}>
              <p>收件人：{recipient.name}</p>
              <p>收件人電話：{recipient.phone}</p>
              <p>收件人地址：{recipient.address}</p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>商品</Accordion.Header>
            <Accordion.Body>
              {products.map((item, index) => (
                <p key={index}>
                  {item.name} - {item.price}
                </p>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* 按鈕 */}
        <div className="d-grid gap-2 d-md-flex justify-content-center">
          <button
            className="btn btn-outline-secondary px-5"
            type="button"
            onClick={() => router.push('/member/orders')}
          >
            查看訂單
          </button>
          <button
            className="btn btn-subtext text-white px-5"
            type="button"
            onClick={() => router.push('/')}
          >
            回到首頁
          </button>
        </div>
      </div>
    </section>
  )
}
