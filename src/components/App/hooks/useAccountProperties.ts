import { useEffect } from 'react'
import { BackendService } from '@/services'

type ConfigType = {
  backendUrl: string
  backendToken: string
}

export function useAccountProperties(config: ConfigType | null) {
  useEffect(() => {
    if (!config) {
      return
    }
    const notNullConfig = config as ConfigType

    async function loadAccountProperties() {
      const backendService = new BackendService(
        notNullConfig.backendUrl,
        notNullConfig.backendToken
      )
      const accountProperties = await backendService.getAccountProperties()

      window.localStorage.accountProperties = JSON.stringify(accountProperties)
    }

    void loadAccountProperties()
  }, [config])
}
