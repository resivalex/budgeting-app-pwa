import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { aggregateTransactions as aggregateTransactionsAction } from '@/redux/appSlice'
import { TransactionDTO } from '@/types'
import _ from 'lodash'

export function useReduxTransactions() {
  const [transactions, setTransactions] = useState<TransactionDTO[]>([])
  const dispatch = useDispatch()

  function setReduxTransactions(transactions: TransactionDTO[]) {
    const sortedTransactions = _.sortBy(
      transactions,
      (transaction: TransactionDTO) => transaction.datetime
    ).reverse()
    setTransactions(sortedTransactions)
    dispatch(aggregateTransactionsAction(sortedTransactions))
  }

  function addReduxTransaction(t: TransactionDTO) {
    const newTransactions = [...transactions, t]
    const sortedTransactions = _.sortBy(
      newTransactions,
      (doc: TransactionDTO) => doc.datetime
    ).reverse()
    setTransactions(sortedTransactions)
    dispatch(aggregateTransactionsAction(sortedTransactions))
  }

  function replaceReduxTransaction(t: TransactionDTO) {
    const newTransactions = [...transactions]
    const index = newTransactions.findIndex((transaction) => transaction._id === t._id)
    newTransactions[index] = t
    const sortedTransactions = _.sortBy(
      newTransactions,
      (doc: TransactionDTO) => doc.datetime
    ).reverse()
    setTransactions(sortedTransactions)
    dispatch(aggregateTransactionsAction(sortedTransactions))
  }

  function removeReduxTransaction(id: string) {
    const newTransactions = [...transactions]
    const index = newTransactions.findIndex((transaction) => transaction._id === id)
    newTransactions.splice(index, 1)
    setTransactions(newTransactions)
    dispatch(aggregateTransactionsAction(newTransactions))
  }

  return {
    transactions,
    setReduxTransactions,
    addReduxTransaction,
    replaceReduxTransaction,
    removeReduxTransaction,
  }
}
