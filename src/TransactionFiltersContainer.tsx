import { useAppSelector } from './redux/appSlice'
import TransactionFilters from './TransactionFilters'
import { useDispatch } from 'react-redux'
import { setAccountName, useTransactionFiltersSelect } from './redux/transactionFiltersSlice'

export default function TransactionFiltersContainer() {
  const filterAccountName = useTransactionFiltersSelect((state) => state.accountName)
  const accountNames = useAppSelector((state) =>
    state.accountDetails.map((details) => details.account)
  )
  const dispatch = useDispatch()

  return (
    <TransactionFilters
      filterAccountName={filterAccountName === '' ? 'Все счета' : filterAccountName}
      accountNames={['Все счета', ...accountNames]}
      onFilterAccountNameChange={(name) => {
        const accountName = name === 'Все счета' ? '' : name
        dispatch(setAccountName(accountName))
      }}
    />
  )
}
