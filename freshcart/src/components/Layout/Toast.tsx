import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { clearToast } from '../../features/ui/uiSlice'
import styles from './Toast.module.css'

const TOAST_DURATION = 3000

export default function Toast() {
  const dispatch = useAppDispatch()
  const toast = useAppSelector(s => s.ui.toast)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => dispatch(clearToast()), TOAST_DURATION)
    return () => clearTimeout(timer)
  }, [toast, dispatch])

  if (!toast) return null

  return (
    <div className={[styles.toast, styles[toast.type]].join(' ')} role="status" aria-live="polite">
      {toast.message}
    </div>
  )
}
