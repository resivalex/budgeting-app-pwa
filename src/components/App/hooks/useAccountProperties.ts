import { useEffect } from 'react'
import { BackendService } from '@/services'

export function useAccountProperties(backendService: BackendService | null) {
  useEffect(() => {
    if (!backendService) {
      return
    }

    async function loadAccountProperties() {
      const accountProperties = await (backendService as BackendService).getAccountProperties()

      window.localStorage.accountProperties = JSON.stringify(accountProperties)
    }

    void loadAccountProperties()
  }, [backendService])
}
