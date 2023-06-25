import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { useSelector } from 'react-redux'
import { TransactionDTO } from '@/types'

interface TransactionsState {
  transactions: TransactionDTO[]
}

const initialState: TransactionsState = {
  transactions: [],
}

export const budgetsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<TransactionDTO[]>) => {
      state.transactions = action.payload
    },
  },
})

export const { setTransactions } =
  budgetsSlice.actions

export function useTransactionsSelect(selector: (state: TransactionsState) => any) {
  return useSelector((state: RootState) => selector(state.transactions))
}

export default budgetsSlice.reducer
