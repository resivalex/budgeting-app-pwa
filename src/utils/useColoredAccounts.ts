import { AccountDetailsDTO, AccountPropertiesDTO, ColoredAccountDetailsDTO } from '@/types'
import { useMemo } from 'react'
import { mergeAccountDetailsAndProperties } from '@/utils'

export function useColoredAccounts(
  localStorageAccountProperties: string,
  accountDetails: AccountDetailsDTO[]
): ColoredAccountDetailsDTO[] {
  return useMemo(() => {
    const accountProperties: AccountPropertiesDTO = localStorageAccountProperties
      ? JSON.parse(localStorageAccountProperties)
      : { accounts: [] }

    return mergeAccountDetailsAndProperties(accountDetails, accountProperties)
  }, [accountDetails, localStorageAccountProperties])
}
