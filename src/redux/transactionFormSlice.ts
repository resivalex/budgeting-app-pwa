import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

interface TransactionFormState {
  type: 'income' | 'expense' | 'transfer'
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
    type: 'expense',
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
    setType: (state, action: PayloadAction<'income' | 'expense' | 'transfer'>) => {
      state.type = action.payload
    },
    setAmount: (state, action: PayloadAction<string>) => {
      state.amount = action.payload
    },
    setAccount: (state, action: PayloadAction<string>) => {
      const account = action.payload
      if (state.type === 'transfer' && state.payeeTransferAccount === account) {
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
    setPayeeTransferAccount: (state, action: PayloadAction<string>) => {
      const account = action.payload
      if (state.type === 'transfer' && state.account === account) {
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
  setType,
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
