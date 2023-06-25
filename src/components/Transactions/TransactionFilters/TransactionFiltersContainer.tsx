import TransactionFilters from './TransactionFilters'
import { AccountDetailsDTO } from '@/types'

export default function TransactionFiltersContainer({
  accountName,
  accountDetails,
  onAccountNameChange,
}: {
  accountName: string
  accountDetails: AccountDetailsDTO[]
  onAccountNameChange: (accountName: string) => void
}) {
  const accountNames = accountDetails.map((details: AccountDetailsDTO) => details.account)

  return (
    <TransactionFilters
      filterAccountName={accountName === '' ? 'Все счета' : accountName}
      accountNames={['Все счета', ...accountNames]}
      onFilterAccountNameChange={(name) => {
        const accountName = name === 'Все счета' ? '' : name
        onAccountNameChange(accountName)
      }}
    />
  )
}
