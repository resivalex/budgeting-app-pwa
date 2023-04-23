import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { useSelector } from 'react-redux'

interface TransactionFiltersState {
  accountName: string
}

const initialState: TransactionFiltersState = {
  accountName: '',
}

export const budgetsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setAccountName: (state, action: PayloadAction<string>) => {
      state.accountName = action.payload
    },
  },
})

export const { setAccountName } = budgetsSlice.actions

export function useTransactionFiltersSelect(selector: (state: TransactionFiltersState) => any) {
  return useSelector((state: RootState) => selector(state.transactionFilters))
}

export default budgetsSlice.reducer
