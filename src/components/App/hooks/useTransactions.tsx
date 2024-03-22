import { useState, useCallback } from 'react'
import { TransactionDTO, TransactionsAggregations } from '@/types'
import _ from 'lodash'
import { TransactionAggregator } from '@/services'

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionDTO[]>([])
  const [transactionsAggregations, setTransactionsAggregations] =
    useState<TransactionsAggregations>({
      accountDetails: [],
      categories: [],
      currencies: [],
      payees: [],
      comments: [],
    })

  function updateTransactionsAggregations(transactions: TransactionDTO[]) {
    const transactionAggregator = new TransactionAggregator(transactions)
    setTransactionsAggregations({
      accountDetails: transactionAggregator.getAccountDetails(),
      categories: transactionAggregator.getSortedCategories(),
      currencies: transactionAggregator.getSortedCurrencies(),
      payees: transactionAggregator.getRecentPayees(),
      comments: transactionAggregator.getRecentComments(),
    })
  }

  const setLocalTransactionsCallback = useCallback(function setLocalTransactions(
    transactions: TransactionDTO[]
  ) {
    const sortedTransactions = _.sortBy(
      transactions,
      (transaction: TransactionDTO) => transaction.datetime
    ).reverse()
    setTransactions(sortedTransactions)
    updateTransactionsAggregations(sortedTransactions)
  },
  [])

  const addLocalTransactionCallback = useCallback(
    function addLocalTransaction(t: TransactionDTO) {
      const newTransactions = [...transactions, t]
      const sortedTransactions = _.sortBy(
        newTransactions,
        (doc: TransactionDTO) => doc.datetime
      ).reverse()
      setTransactions(sortedTransactions)
      updateTransactionsAggregations(sortedTransactions)
    },
    [transactions]
  )

  const replaceLocalTransactionCallback = useCallback(
    function replaceLocalTransaction(t: TransactionDTO) {
      const newTransactions = [...transactions]
      const index = newTransactions.findIndex((transaction) => transaction._id === t._id)
      newTransactions[index] = t
      const sortedTransactions = _.sortBy(
        newTransactions,
        (doc: TransactionDTO) => doc.datetime
      ).reverse()
      setTransactions(sortedTransactions)
      updateTransactionsAggregations(sortedTransactions)
    },
    [transactions]
  )

  const removeLocalTransactionCallback = useCallback(
    function removeLocalTransaction(id: string) {
      const newTransactions = [...transactions]
      const index = newTransactions.findIndex((transaction) => transaction._id === id)
      newTransactions.splice(index, 1)
      setTransactions(newTransactions)
      updateTransactionsAggregations(newTransactions)
    },
    [transactions]
  )

  return {
    transactions,
    transactionsAggregations,
    setLocalTransactions: setLocalTransactionsCallback,
    addLocalTransaction: addLocalTransactionCallback,
    replaceLocalTransaction: replaceLocalTransactionCallback,
    removeLocalTransaction: removeLocalTransactionCallback,
  }
}
