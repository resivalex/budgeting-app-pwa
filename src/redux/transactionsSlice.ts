import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { useSelector } from 'react-redux'
import { TransactionDTO } from '@/types'

interface TransactionsState {
  transactions: TransactionDTO[]
  focusedTransactionId: string
}

const initialState: TransactionsState = {
  transactions: [],
  focusedTransactionId: '',
}

export const budgetsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<TransactionDTO[]>) => {
      state.transactions = action.payload
    },
    setFocusedTransactionId: (state, action: PayloadAction<string>) => {
      state.focusedTransactionId = action.payload
    },
    resetFocusedTransactionId: (state) => {
      state.focusedTransactionId = ''
    },
  },
})

export const { setTransactions, setFocusedTransactionId, resetFocusedTransactionId } =
  budgetsSlice.actions

export function useTransactionsSelect(selector: (state: TransactionsState) => any) {
  return useSelector((state: RootState) => selector(state.transactions))
}

export default budgetsSlice.reducer
