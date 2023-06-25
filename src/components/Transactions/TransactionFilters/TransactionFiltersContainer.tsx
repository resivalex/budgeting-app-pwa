import { useAppSelector } from '@/redux/appSlice'
import TransactionFilters from './TransactionFilters'
import { AccountDetailsDTO } from '@/types'

export default function TransactionFiltersContainer({
  accountName,
  onAccountNameChange,
}: {
  accountName: string
  onAccountNameChange: (accountName: string) => void
}) {
  const transactionAggregations = useAppSelector((state) => state.aggregations)
  const accountNames = transactionAggregations.accountDetails.map(
    (details: AccountDetailsDTO) => details.account
  )

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
