import { useEffect } from 'react'
import { BackendService } from '@/services'

export function useAccountProperties(backendService: BackendService) {
  useEffect(() => {
    async function loadAccountProperties() {
      const accountProperties = await (backendService as BackendService).getAccountProperties()

      localStorage.accountProperties = JSON.stringify(accountProperties)
    }

    void loadAccountProperties()
  }, [backendService])
}
