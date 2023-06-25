import { configureStore, combineReducers } from '@reduxjs/toolkit'
import appReducer from './appSlice'
import transactionsReducer from './transactionsSlice'

const rootReducer = combineReducers({
  app: appReducer,
  transactions: transactionsReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default store
