// components/CartLoading.jsx
import styles from './cart-loading.module.scss'

export default function CartLoading() {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.cartIcon}>🛒</div>
      <div className={styles.text}>Loading...</div>
    </div>
  )
}
