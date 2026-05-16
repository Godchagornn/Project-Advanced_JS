import styles from './QuantityStepper.module.css'

interface Props {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  disabled?: boolean
}

export default function QuantityStepper({ value, min = 1, max = 99, onChange, disabled = false }: Props) {
  return (
    <div className={styles.stepper}>
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className={styles.value}>{value}</span>
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
