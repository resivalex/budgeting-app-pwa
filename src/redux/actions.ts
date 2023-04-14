// Define action types
export const SET_IS_AUTHENTICATED = 'SET_IS_AUTHENTICATED'
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS'
export const SET_ERROR = 'SET_ERROR'
export const SET_IS_LOADING = 'SET_IS_LOADING'
export const SET_OFFLINE_MODE = 'SET_OFFLINE_MODE'
export const SET_LAST_NOTIFICATION_TEXT = 'SET_LAST_NOTIFICATION_TEXT'

// Action type interfaces
interface SetIsAuthenticatedAction {
  type: typeof SET_IS_AUTHENTICATED
  payload: boolean
}

interface SetTransactionsAction {
  type: typeof SET_TRANSACTIONS
  payload: any[]
}

interface SetErrorAction {
  type: typeof SET_ERROR
  payload: string
}

interface SetIsLoadingAction {
  type: typeof SET_IS_LOADING
  payload: boolean
}

interface SetOfflineModeAction {
  type: typeof SET_OFFLINE_MODE
  payload: boolean
}

interface SetLastNotificationTextAction {
  type: typeof SET_LAST_NOTIFICATION_TEXT
  payload: string
}

// Combine action types
export type ActionTypes =
  | SetIsAuthenticatedAction
  | SetTransactionsAction
  | SetErrorAction
  | SetIsLoadingAction
  | SetOfflineModeAction
  | SetLastNotificationTextAction

// Action creators
export const setIsAuthenticated = (isAuthenticated: boolean): SetIsAuthenticatedAction => ({
  type: SET_IS_AUTHENTICATED,
  payload: isAuthenticated,
})

export const setTransactions = (transactions: any[]): SetTransactionsAction => ({
  type: SET_TRANSACTIONS,
  payload: transactions,
})

export const setError = (error: string): SetErrorAction => ({
  type: SET_ERROR,
  payload: error,
})

export const setIsLoading = (isLoading: boolean): SetIsLoadingAction => ({
  type: SET_IS_LOADING,
  payload: isLoading,
})

export const setOfflineMode = (offlineMode: boolean): SetOfflineModeAction => ({
  type: SET_OFFLINE_MODE,
  payload: offlineMode,
})

export const setLastNotificationText = (
  lastNotificationText: string
): SetLastNotificationTextAction => ({
  type: SET_LAST_NOTIFICATION_TEXT,
  payload: lastNotificationText,
})
