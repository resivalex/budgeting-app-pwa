import { configureStore, combineReducers } from '@reduxjs/toolkit'
import appReducer from './appSlice'
import transactionFormReducer from './transactionFormSlice'
import budgetsReducer from './budgetsSlice'

const rootReducer = combineReducers({
  app: appReducer,
  transactionForm: transactionFormReducer,
  budgets: budgetsReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default store
