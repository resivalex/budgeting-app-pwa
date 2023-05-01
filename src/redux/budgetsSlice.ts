import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { useSelector } from 'react-redux'
import { BudgetDTO } from '@/types'

interface BudgetsState {
  budgets: BudgetDTO[]
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
    setBudgets: (state, action: PayloadAction<BudgetDTO[]>) => {
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
