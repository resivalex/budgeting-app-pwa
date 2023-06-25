import { configureStore, combineReducers } from '@reduxjs/toolkit'
import appReducer from './appSlice'
import budgetsReducer from './budgetsSlice'
import transactionsReducer from './transactionsSlice'

const rootReducer = combineReducers({
  app: appReducer,
  budgets: budgetsReducer,
  transactions: transactionsReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default store
