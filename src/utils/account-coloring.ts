import { AccountDetailsDTO, AccountPropertiesDTO, ColoredAccountDetailsDTO } from '@/types'

const defaultColor = '#ffffff'

export function mergeAccountDetailsAndProperties(
  accountDetails: AccountDetailsDTO[],
  accountProperties: AccountPropertiesDTO
): ColoredAccountDetailsDTO[] {
  const coloredAccounts: ColoredAccountDetailsDTO[] = []
  const uncoloredAccounts: ColoredAccountDetailsDTO[] = []
  accountProperties.accounts.forEach((account) => {
    const accountDetail = accountDetails.find((a: AccountDetailsDTO) => a.account === account.name)
    if (!accountDetail) {
      return
    }
    coloredAccounts.push({
      account: account.name,
      currency: accountDetail.currency,
      balance: accountDetail.balance,
      color: account.color,
    })
  })
  accountDetails.forEach((accountDetailsItem: AccountDetailsDTO) => {
    const properties = accountProperties.accounts.find((a) => a.name === accountDetailsItem.account)

    if (properties) {
      return
    }

    uncoloredAccounts.push({
      account: accountDetailsItem.account,
      currency: accountDetailsItem.currency,
      balance: accountDetailsItem.balance,
      color: defaultColor,
    })
  })

  return [...coloredAccounts, ...uncoloredAccounts]
}
