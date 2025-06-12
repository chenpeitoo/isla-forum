import React from 'react'
import PropTypes from 'prop-types'
import './product-quantity-select.css'

const QuantitySelector = ({ quantity, setQuantity }) => {
  const increase = () => setQuantity((q) => q + 1)
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1))

  return (
    <div className="number-select d-flex align-items-center">
      <button
        className="number-select-reduce number-select-btn"
        type="button"
        onClick={decrease}
      >
        <i className="bx bx-minus" />
      </button>
      <div className="number-select-num">{quantity}</div>
      <button
        className="number-select-increase number-select-btn"
        type="button"
        onClick={increase}
      >
        <i className="bx bx-plus" />
      </button>
    </div>
  )
}

QuantitySelector.propTypes = {
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
}

export default QuantitySelector
