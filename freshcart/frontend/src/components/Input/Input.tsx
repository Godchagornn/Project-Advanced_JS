import type { InputHTMLAttributes, ReactNode } from 'react'
import styles from './Input.module.css'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
}

export default function Input({ label, error, icon, id, className = '', ...rest }: Props) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={styles.inputWrap}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          id={id}
          className={[styles.input, error ? styles.hasError : '', icon ? styles.withIcon : '', className]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
