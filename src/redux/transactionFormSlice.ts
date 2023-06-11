import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

interface TransactionFormState {
  account: string
  payeeTransferAccount: string
}

function generateInitialState(): TransactionFormState {
  return {
    account: '',
    payeeTransferAccount: '',
  }
}

const initialState: TransactionFormState = generateInitialState()

export const transactionFormSlice = createSlice({
  name: 'transactionForm',
  initialState,
  reducers: {
    setAccount: (
      state,
      action: PayloadAction<{ type: 'expense' | 'income' | 'transfer'; account: string }>
    ) => {
      const { type, account } = action.payload
      if (type === 'transfer' && state.payeeTransferAccount === account) {
        state.payeeTransferAccount = state.account
      }
      state.account = account
    },
    setPayeeTransferAccount: (
      state,
      action: PayloadAction<{ type: 'expense' | 'income' | 'transfer'; account: string }>
    ) => {
      const { type, account } = action.payload
      if (type === 'transfer' && state.account === account) {
        state.account = state.payeeTransferAccount
      }
      state.payeeTransferAccount = account
    },
    reset: () => {
      return generateInitialState()
    },
  },
})

export const { setAccount, setPayeeTransferAccount, reset } = transactionFormSlice.actions

export const selectTransactionForm = (state: RootState) => state.transactionForm

export default transactionFormSlice.reducer
