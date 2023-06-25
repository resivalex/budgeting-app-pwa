import { configureStore, combineReducers } from '@reduxjs/toolkit'

const rootReducer = combineReducers({})

const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default store
