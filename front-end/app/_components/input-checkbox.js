import styles from './input-checkbox.module.css'

const inputCheckbox = ({ id, label, checked, onChange, disabled = false }) => (
  <label
    htmlFor={id}
    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    className={styles.checkboxLabel}
  >
    <input
      id={id}
      type="checkbox"
      className={styles.checkboxLabel}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
    />
    {label}
  </label>
)
