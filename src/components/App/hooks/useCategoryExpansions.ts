import { useEffect } from 'react'
import { BackendService } from '@/services'

type ConfigType = {
  backendUrl: string
  backendToken: string
}

export function useCategoryExpansions(config: ConfigType | null) {
  useEffect(() => {
    if (!config) {
      return
    }
    const notNullConfig = config as ConfigType

    async function loadCategoryExpansions() {
      const backendService = new BackendService(
        notNullConfig.backendUrl,
        notNullConfig.backendToken
      )
      const categoryExpansions = await backendService.getCategoryExpansions()

      window.localStorage.categoryExpansions = JSON.stringify(categoryExpansions)
    }

    void loadCategoryExpansions()
  }, [config])
}
