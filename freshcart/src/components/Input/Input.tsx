import type { InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, id, className = '', ...rest }: Props) {
  const inputClass = [styles.input, error ? styles.hasError : '', className].filter(Boolean).join(' ')

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} className={inputClass} {...rest} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
