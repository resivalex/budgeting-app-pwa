import { useEffect } from 'react'
import { BackendService } from '@/services'

export function useCategoryExpansions(backendService: BackendService) {
  useEffect(() => {
    async function loadCategoryExpansions() {
      const categoryExpansions = await (backendService as BackendService).getCategoryExpansions()

      localStorage.categoryExpansions = JSON.stringify(categoryExpansions)
    }

    void loadCategoryExpansions()
  }, [backendService])
}
