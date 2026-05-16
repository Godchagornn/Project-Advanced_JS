import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { closeConfirmDialog } from '../../features/ui/uiSlice'
import Button from '../Button/Button'
import styles from './ConfirmDialog.module.css'

interface Props {
  onConfirm: (actionId: string) => void
}

export default function ConfirmDialog({ onConfirm }: Props) {
  const dispatch = useAppDispatch()
  const { open, message, onConfirmActionId } = useAppSelector(s => s.ui.confirmDialog)

  if (!open) return null

  const handleConfirm = () => {
    if (onConfirmActionId) onConfirm(onConfirmActionId)
    dispatch(closeConfirmDialog())
  }

  const handleCancel = () => dispatch(closeConfirmDialog())

  return (
    <div className={styles.overlay} onClick={handleCancel}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>
        <div className={styles.icon}>🗑️</div>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}
