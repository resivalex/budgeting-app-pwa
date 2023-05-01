import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { useSelector } from 'react-redux'
import { TransactionDTO } from '../components/Transaction'

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
  budgetMonthFirstDay: string
  availableMonths: string[]
}

const currentMonthFirstDay = new Date().toISOString().slice(0, 7) + '-01'

const initialState: BudgetsState = {
  budgets: [],
  focusedBudgetName: '',
  budgetMonthFirstDay: currentMonthFirstDay,
  availableMonths: [currentMonthFirstDay],
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
    setBudgetMonthFirstDay: (state, action: PayloadAction<string>) => {
      state.budgetMonthFirstDay = action.payload
    },
    setAvailableMonths: (state, action: PayloadAction<string[]>) => {
      state.availableMonths = action.payload
    },
  },
})

export const { setBudgets, setFocusedBudgetName, setBudgetMonthFirstDay, setAvailableMonths } =
  budgetsSlice.actions

export function useBudgetsSelector(selector: (state: BudgetsState) => any) {
  return useSelector((state: RootState) => selector(state.budgets))
}

export default budgetsSlice.reducer
