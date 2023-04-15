import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

interface TransactionFormState {
  type: 'income' | 'expense'
  amount: string
  account: string
  currency: string
  category: string
  payee: string
  comment: string
  datetime: string
}

const initialState: TransactionFormState = {
  type: 'expense',
  amount: '',
  account: '',
  currency: '',
  category: '',
  payee: '',
  comment: '',
  datetime: new Date().toISOString(),
}

export const transactionFormSlice = createSlice({
  name: 'transactionForm',
  initialState,
  reducers: {
    setType: (state, action: PayloadAction<'income' | 'expense'>) => {
      state.type = action.payload
    },
    setAmount: (state, action: PayloadAction<string>) => {
      state.amount = action.payload
    },
    setAccount: (state, action: PayloadAction<string>) => {
      state.account = action.payload
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
    setComment: (state, action: PayloadAction<string>) => {
      state.comment = action.payload
    },
    setDatetime: (state, action: PayloadAction<string>) => {
      state.datetime = action.payload
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
  setComment,
  setDatetime,
} = transactionFormSlice.actions

export const selectTransactionForm = (state: RootState) => state.transactionForm

export default transactionFormSlice.reducer
