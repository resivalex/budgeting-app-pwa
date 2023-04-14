import {
  ActionTypes,
  SET_IS_AUTHENTICATED,
  SET_TRANSACTIONS,
  SET_ERROR,
  SET_IS_LOADING,
  SET_OFFLINE_MODE,
  SET_LAST_NOTIFICATION_TEXT,
} from './actions'
import { AppState } from './types'

const initialState: AppState = {
  isAuthenticated: false,
  transactions: [],
  error: '',
  isLoading: false,
  offlineMode: false,
  lastNotificationText: '',
}

const rootReducer = (state = initialState, action: ActionTypes): AppState => {
  switch (action.type) {
    case SET_IS_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload }
    case SET_TRANSACTIONS:
      return { ...state, transactions: action.payload }
    case SET_ERROR:
      return { ...state, error: action.payload }
    case SET_IS_LOADING:
      return { ...state, isLoading: action.payload }
    case SET_OFFLINE_MODE:
      return { ...state, offlineMode: action.payload }
    case SET_LAST_NOTIFICATION_TEXT:
      return { ...state, lastNotificationText: action.payload }
    default:
      return state
  }
}

export default rootReducer
