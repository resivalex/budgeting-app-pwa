import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './appSlice'

const store = configureStore({
  reducer: rootReducer,
})

export default store
