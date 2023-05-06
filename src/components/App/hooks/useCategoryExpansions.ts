import { useEffect } from 'react'
import { BackendService } from '@/services'

export function useCategoryExpansions(backendService: BackendService | null) {
  useEffect(() => {
    if (!backendService) {
      return
    }

    async function loadCategoryExpansions() {
      const categoryExpansions = await (backendService as BackendService).getCategoryExpansions()

      window.localStorage.categoryExpansions = JSON.stringify(categoryExpansions)
    }

    void loadCategoryExpansions()
  }, [backendService])
}
