import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  message: string
  type: ToastType
}

export interface ConfirmDialog {
  open: boolean
  message: string
  onConfirmActionId: string | null
}

export interface UiState {
  confirmDialog: ConfirmDialog
  toast: Toast | null
  isCartDrawerOpen: boolean
}

const initialState: UiState = {
  confirmDialog: {
    open: false,
    message: '',
    onConfirmActionId: null,
  },
  toast: null,
  isCartDrawerOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openConfirmDialog(
      state,
      action: PayloadAction<{ message: string; onConfirmActionId: string }>
    ) {
      state.confirmDialog = {
        open: true,
        message: action.payload.message,
        onConfirmActionId: action.payload.onConfirmActionId,
      }
    },
    closeConfirmDialog(state) {
      state.confirmDialog = { open: false, message: '', onConfirmActionId: null }
    },
    showToast(state, action: PayloadAction<Toast>) {
      state.toast = action.payload
    },
    clearToast(state) {
      state.toast = null
    },
    openCartDrawer(state) {
      state.isCartDrawerOpen = true
    },
    closeCartDrawer(state) {
      state.isCartDrawerOpen = false
    },
    toggleCartDrawer(state) {
      state.isCartDrawerOpen = !state.isCartDrawerOpen
    },
  },
})

export const {
  openConfirmDialog,
  closeConfirmDialog,
  showToast,
  clearToast,
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
} = uiSlice.actions

export default uiSlice.reducer
