import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { useSelector } from 'react-redux'
import { BudgetDTO } from '@/types'

interface BudgetsState {
  budgets: BudgetDTO[]
}

const initialState: BudgetsState = {
  budgets: [],
}

export const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    setBudgets: (state, action: PayloadAction<BudgetDTO[]>) => {
      state.budgets = action.payload
    },
  },
})

export const { setBudgets } = budgetsSlice.actions

export function useBudgetsSelector(selector: (state: BudgetsState) => any) {
  return useSelector((state: RootState) => selector(state.budgets))
}

export default budgetsSlice.reducer
