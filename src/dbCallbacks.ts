// dbCallbacks.ts
type SetIsLoading = (isLoading: boolean) => void

const createDBCallbacks = (setIsLoading: SetIsLoading) => ({
  handleDBChange: () => {
    console.log('DB change')
    setIsLoading(true)
  },

  handleDBPaused: () => {
    console.log('DB paused')
    setIsLoading(false)
  },
  handleDBActive: () => {
    console.log('DB active')
    setIsLoading(true)
  },

  handleDBDenied: () => {
    console.log('DB denied')
    setIsLoading(false)
  },

  handleDBComplete: () => {
    console.log('DB complete')
    setIsLoading(false)
  },

  handleDBError: () => {
    console.log('DB error')
    setIsLoading(false)
  },
})

export default createDBCallbacks
