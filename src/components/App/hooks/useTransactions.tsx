import { useState } from 'react'
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

  function setLocalTransactions(transactions: TransactionDTO[]) {
    const sortedTransactions = _.sortBy(
      transactions,
      (transaction: TransactionDTO) => transaction.datetime
    ).reverse()
    setTransactions(sortedTransactions)
    updateTransactionsAggregations(sortedTransactions)
  }

  function addLocalTransaction(t: TransactionDTO) {
    const newTransactions = [...transactions, t]
    const sortedTransactions = _.sortBy(
      newTransactions,
      (doc: TransactionDTO) => doc.datetime
    ).reverse()
    setTransactions(sortedTransactions)
    updateTransactionsAggregations(sortedTransactions)
  }

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
  }

  function removeLocalTransaction(id: string) {
    const newTransactions = [...transactions]
    const index = newTransactions.findIndex((transaction) => transaction._id === id)
    newTransactions.splice(index, 1)
    setTransactions(newTransactions)
    updateTransactionsAggregations(newTransactions)
  }

  return {
    transactions,
    transactionsAggregations,
    setLocalTransactions,
    addLocalTransaction,
    replaceLocalTransaction,
    removeLocalTransaction,
  }
}
