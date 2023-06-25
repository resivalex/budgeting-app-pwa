import { useAppSelector } from '@/redux/appSlice'
import TransactionFilters from './TransactionFilters'

export default function TransactionFiltersContainer({
  accountName,
  onAccountNameChange,
}: {
  accountName: string
  onAccountNameChange: (accountName: string) => void
}) {
  const accountNames = useAppSelector((state) =>
    state.accountDetails.map((details) => details.account)
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
