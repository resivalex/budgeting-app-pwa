import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

interface TransactionFormState {
  account: string
  payeeTransferAccount: string
  payeeSuggestions: string[]
  commentSuggestions: string[]
}

function generateInitialState(): TransactionFormState {
  return {
    account: '',
    payeeTransferAccount: '',
    payeeSuggestions: [],
    commentSuggestions: [],
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
    setPayeeSuggestions: (state, action: PayloadAction<string[]>) => {
      state.payeeSuggestions = action.payload
    },
    setCommentSuggestions: (state, action: PayloadAction<string[]>) => {
      state.commentSuggestions = action.payload
    },
    reset: () => {
      return generateInitialState()
    },
  },
})

export const {
  setAccount,
  setPayeeTransferAccount,
  setPayeeSuggestions,
  setCommentSuggestions,
  reset,
} = transactionFormSlice.actions

export const selectTransactionForm = (state: RootState) => state.transactionForm

export default transactionFormSlice.reducer
