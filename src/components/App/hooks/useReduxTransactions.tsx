import { useDispatch } from 'react-redux'
import {
  AppState,
  setTransactions as setTransactionsAction,
  useAppSelector,
} from '@/redux/appSlice'
import { TransactionDTO } from '@/types'
import _ from 'lodash'

export function useReduxTransactions() {
  const dispatch = useDispatch()
  const transactions = useAppSelector((state: AppState) => state.transactions)

  function setReduxTransactions(transactions: TransactionDTO[]) {
    const sortedTransactions = _.sortBy(
      transactions,
      (transaction: TransactionDTO) => transaction.datetime
    ).reverse()
    dispatch(setTransactionsAction(sortedTransactions))
  }

  function addReduxTransaction(t: TransactionDTO) {
    const newTransactions = [...transactions, t]
    const sortedTransactions = _.sortBy(
      newTransactions,
      (doc: TransactionDTO) => doc.datetime
    ).reverse()
    dispatch(setTransactionsAction(sortedTransactions))
  }

  function replaceReduxTransaction(t: TransactionDTO) {
    const newTransactions = [...transactions]
    const index = newTransactions.findIndex((transaction) => transaction._id === t._id)
    newTransactions[index] = t
    const sortedTransactions = _.sortBy(
      newTransactions,
      (doc: TransactionDTO) => doc.datetime
    ).reverse()
    dispatch(setTransactionsAction(sortedTransactions))
  }

  function removeReduxTransaction(id: string) {
    const newTransactions = [...transactions]
    const index = newTransactions.findIndex((transaction) => transaction._id === id)
    newTransactions.splice(index, 1)
    dispatch(setTransactionsAction(newTransactions))
  }

  return {
    transactions,
    setReduxTransactions,
    addReduxTransaction,
    replaceReduxTransaction,
    removeReduxTransaction,
  }
}
