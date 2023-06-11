import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

interface TransactionFormState {
  amount: string
  account: string
  currency: string
  category: string
  payee: string
  payeeTransferAccount: string
  comment: string
  datetime: string
  payeeSuggestions: string[]
  commentSuggestions: string[]
}

function generateInitialState(): TransactionFormState {
  return {
    amount: '',
    account: '',
    currency: '',
    category: '',
    payee: '',
    payeeTransferAccount: '',
    comment: '',
    datetime: new Date().toISOString(),
    payeeSuggestions: [],
    commentSuggestions: [],
  }
}

const initialState: TransactionFormState = generateInitialState()

export const transactionFormSlice = createSlice({
  name: 'transactionForm',
  initialState,
  reducers: {
    setAmount: (state, action: PayloadAction<string>) => {
      state.amount = action.payload
    },
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
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload
    },
    setPayee: (state, action: PayloadAction<string>) => {
      state.payee = action.payload
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
    setComment: (state, action: PayloadAction<string>) => {
      state.comment = action.payload
    },
    setDatetime: (state, action: PayloadAction<string>) => {
      state.datetime = action.payload
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
  setAmount,
  setAccount,
  setCurrency,
  setCategory,
  setPayee,
  setPayeeTransferAccount,
  setComment,
  setDatetime,
  setPayeeSuggestions,
  setCommentSuggestions,
  reset,
} = transactionFormSlice.actions

export const selectTransactionForm = (state: RootState) => state.transactionForm

export default transactionFormSlice.reducer
