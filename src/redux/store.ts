import { configureStore, combineReducers } from '@reduxjs/toolkit'
import appReducer from './appSlice'
import transactionFormReducer from './transactionFormSlice'
import budgetsReducer from './budgetsSlice'
import transactionsReducer from './transactionsSlice'
import trancationFiltersReducer from './transactionFiltersSlice'

const rootReducer = combineReducers({
  app: appReducer,
  transactionForm: transactionFormReducer,
  budgets: budgetsReducer,
  transactions: transactionsReducer,
  transactionFilters: trancationFiltersReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default store
