import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { useSelector } from 'react-redux'
import { TransactionDTO } from '../Transaction'

export type Budget = {
  name: string
  currency: string
  amount: number
  categories: string[]
  transactions: TransactionDTO[]
  spentAmount: number
}

interface BudgetsState {
  budgets: Budget[]
  focusedBudgetName: string
}

const initialState: BudgetsState = {
  budgets: [],
  focusedBudgetName: '',
}

export const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    setBudgets: (state, action: PayloadAction<Budget[]>) => {
      state.budgets = action.payload
    },
    setFocusedBudgetName: (state, action: PayloadAction<string>) => {
      state.focusedBudgetName = action.payload
    },
  },
})

export const { setBudgets, setFocusedBudgetName } = budgetsSlice.actions

export function useBudgetsSelector(selector: (state: BudgetsState) => any) {
  return useSelector((state: RootState) => selector(state.budgets))
}

export default budgetsSlice.reducer
