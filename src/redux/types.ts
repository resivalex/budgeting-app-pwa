export interface AppState {
  isAuthenticated: boolean
  transactions: any[]
  error: string
  isLoading: boolean
  offlineMode: boolean
  lastNotificationText: string
}
