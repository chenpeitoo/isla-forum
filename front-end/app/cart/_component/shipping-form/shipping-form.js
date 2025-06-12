import styles from './shipping-form.module.scss'
import { useState, useEffect } from 'react'

import { useShip711StoreOpener } from '../../hook/ship-711/use-ship-711-store.js'
import { nextUrl } from '@/config'

export default function ShippingForm({
  memberSameInfo,
  setMemberSameInfo,
  handleCopyMemberInfo,
  onShippingChange,
}) {
  const [shippingWay, setShippingWay] = useState('home')
  const [check, setCheck] = useState(false)

  const { store711, openWindow } = useShip711StoreOpener(
    `${nextUrl}/cart/hook/ship-711/api`,
    { autoCloseMins: 3 }
  )

  useEffect(() => {
    if (store711 && store711.storeid) {
      setShippingWay('711')
    }
  }, [store711])

  // 回傳配送資訊給父層（shippingWay/member/store711 改變時）
  useEffect(() => {
    if (!onShippingChange) return

    if (shippingWay === 'home') {
      onShippingChange({
        shippingMethod: '宅配',
        recipientName: memberSameInfo.recipientName,
        recipientPhone: memberSameInfo.recipientPhone,
        recipientAddress: memberSameInfo.recipientAdress,
        pickupStoreName: '',
        pickupStoreAddress: '',
      })
    } else if (shippingWay === '711' && store711?.storeid) {
      onShippingChange({
        shippingMethod: '超商取貨',
        recipientName: '',
        recipientPhone: '',
        recipientAddress: '',
        pickupStoreName: store711.storename || '',
        pickupStoreAddress: store711.storeaddress || '',
      })
    }
  }, [shippingWay, memberSameInfo, store711, onShippingChange])

  // checkbox 點擊時處理
  const handleCheckboxChange = (evt) => {
    const isChecked = evt.target.checked
    setCheck(isChecked)
    handleCopyMemberInfo(isChecked)
  }

  return (
    <form method="POST" action="" id="formHome" className="card-style mb-4 p-4">
      <h5 className="fw-bold mb-5 text-maintext">商品配送方式</h5>

      {/* 宅配 */}
      <div className="d-flex justify-content-between">
        <div className="form-check mb-3">
          <input
            className={`${styles.formCheckInput} form-check-input`}
            type="radio"
            name="shipping"
            id="radioShipHome"
            value="home"
            checked={shippingWay === 'home'}
            onChange={() => setShippingWay('home')}
          />
          <label htmlFor="radioShipHome" className="form-check-label">
            宅配到府
          </label>
        </div>
        
      </div>

      {shippingWay === 'home' && (
        <div className="shipInfo d-flex flex-column">
          <div className="form-check mb-3 ms-4">
            <input
              className={`${styles.checkboxInput} form-check-input`}
              type="checkbox"
              id="sameAsMember"
              checked={check}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="sameAsMember" className="form-check-label">
              收件人資料與會員資料相符
            </label>
          </div>
          <div id="recipientForm" className="mb-4 ms-4">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                收件人姓名*
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="真實姓名"
                value={memberSameInfo.recipientName}
                onChange={(evt) =>
                  setMemberSameInfo({
                    ...memberSameInfo,
                    recipientName: evt.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                聯絡電話*
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                placeholder="聯絡電話"
                value={memberSameInfo.recipientPhone}
                onChange={(evt) =>
                  setMemberSameInfo({
                    ...memberSameInfo,
                    recipientPhone: evt.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                寄送地址*
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                placeholder="請輸入地址"
                value={memberSameInfo.recipientAdress}
                onChange={(evt) =>
                  setMemberSameInfo({
                    ...memberSameInfo,
                    recipientAdress: evt.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* 超商取貨選項 */}
      <div className="d-flex justify-content-between">
        <div className="form-check mb-3">
          <input
            className={`${styles.formCheckInput} form-check-input`}
            type="radio"
            name="shipping"
            id="radioShip711"
            value="711"
            checked={shippingWay === '711'}
            onChange={() => setShippingWay('711')}
          />
          <label htmlFor="radioShip711" className="form-check-label">
            超商取貨
          </label>
        </div>
        
      </div>
      {/* 711 選擇門市 */}
      {shippingWay === '711' && (
        <div id="store711Info" className="d-flex flex-column ms-4 p-3">
          <h6 className="fw-bold mb-3 text-subtext">選擇 7-11 取貨門市</h6>
          <div className="form-check mb-3">
            <label htmlFor="storeName" className="me-2">
              門市名稱
            </label>
            <input
              className="w-50"
              type="text"
              name="storeName"
              id="storeName"
              value={store711.storename}
              readOnly
            />
          </div>
          <div className="d-flex flex-column">
            <div className="form-check mb-3">
              <label htmlFor="storeAddress" className="me-2">
                門市地址
              </label>
              <input
                className="w-50"
                type="text"
                name="storeAddress"
                id="storeAddress"
                value={store711.storeaddress}
                readOnly
              />
            </div>
            <button
              className="btn btn-secondary btn-sm ms-auto"
              onClick={openWindow}
            >
              選擇門市
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
