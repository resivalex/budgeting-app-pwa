import _ from 'lodash'
import { TransactionDTO, AccountDetailsDTO } from '@/types'

type BalanceChange = {
  account: string
  currency: string
  amount: number
}

function calculateBalanceChanges(transaction: any): BalanceChange[] {
  if (transaction.type === 'transfer') {
    return [
      {
        account: transaction.account,
        currency: transaction.currency,
        amount: -parseFloat(transaction.amount),
      },
      {
        account: transaction.payee,
        currency: transaction.currency,
        amount: parseFloat(transaction.amount),
      },
    ]
  }
  const transactionSign = transaction.type === 'expense' ? -1 : 1

  return [
    {
      account: transaction.account,
      currency: transaction.currency,
      amount: parseFloat(transaction.amount) * transactionSign,
    },
  ]
}

export default class TransactionAggregator {
  transactions: TransactionDTO[]

  constructor(transactions: any[]) {
    this.transactions = transactions
  }

  getAccountDetails(): AccountDetailsDTO[] {
    const accountsStat = this.transactions.reduce((accountCurrencies: any, transaction: any) => {
      if (!accountCurrencies[transaction.account]) {
        accountCurrencies[transaction.account] = {
          currency: transaction.currency,
          balance: 0,
        }
      }
      const balanceChanges = calculateBalanceChanges(transaction)
      for (const balanceChange of balanceChanges) {
        if (!accountCurrencies[balanceChange.account]) {
          accountCurrencies[balanceChange.account] = {
            currency: balanceChange.currency,
            balance: 0,
          }
        }
        if (accountCurrencies[balanceChange.account].currency !== balanceChange.currency) {
          throw new Error('Currency mismatch')
        }
        accountCurrencies[balanceChange.account].balance += balanceChange.amount
      }

      return accountCurrencies
    }, {})
    const accountDetails = Object.keys(accountsStat).map((account) => {
      return {
        account: account,
        currency: accountsStat[account].currency,
        balance: accountsStat[account].balance,
      }
    })
    accountDetails.sort((a, b) => (a.balance > b.balance ? -1 : 1))

    return accountDetails
  }

  getSortedCategories() {
    const categoriesCounts = this.transactions.reduce((categories: any, transaction: any) => {
      if (!categories[transaction.category]) {
        categories[transaction.category] = 0
      }
      categories[transaction.category]++

      return categories
    }, {})

    const sortedCategories = Object.keys(categoriesCounts).sort((a, b) => {
      return categoriesCounts[b] - categoriesCounts[a]
    })

    return sortedCategories.filter(_.identity)
  }

  getSortedCurrencies() {
    return _(this.transactions)
      .map((t) => t.currency)
      .uniq()
      .sortBy()
      .value()
  }

  getRecentPayees() {
    const payeesSet: { [name: string]: boolean } = {}
    const result = []
    const sortedTransactions = _.sortBy(this.transactions, (t) => -new Date(t.datetime).getTime())
    for (const transaction of sortedTransactions) {
      if (transaction.type !== 'transfer' && transaction.payee && !payeesSet[transaction.payee]) {
        payeesSet[transaction.payee] = true
        result.push(transaction.payee)
      }
    }

    return result
  }

  getRecentPayeesByCategory(category: string) {
    const payeesSet: { [name: string]: boolean } = {}
    const result = []
    const sortedTransactions = _.sortBy(this.transactions, (t) => -new Date(t.datetime).getTime())
    const orderedTransactions = [
      ...sortedTransactions.filter((t) => t.category === category),
      ...sortedTransactions.filter((t) => t.category !== category),
    ]

    for (const transaction of orderedTransactions) {
      if (transaction.type !== 'transfer' && transaction.payee && !payeesSet[transaction.payee]) {
        payeesSet[transaction.payee] = true
        result.push(transaction.payee)
      }
    }

    return result
  }

  getRecentComments() {
    const commentsSet: { [name: string]: boolean } = {}
    const result = []
    const sortedTransactions = _.sortBy(this.transactions, (t) => -new Date(t.datetime).getTime())
    for (const transaction of sortedTransactions) {
      if (transaction.comment && !commentsSet[transaction.comment]) {
        commentsSet[transaction.comment] = true
        result.push(transaction.comment)
      }
    }

    return result
  }

  getRecentCommentsByCategory(category: string) {
    const commentsSet: { [name: string]: boolean } = {}
    const result = []
    const sortedTransactions = _.sortBy(this.transactions, (t) => -new Date(t.datetime).getTime())
    const orderedTransactions = [
      ...sortedTransactions.filter((t) => t.category === category),
      ...sortedTransactions.filter((t) => t.category !== category),
    ]

    for (const transaction of orderedTransactions) {
      if (transaction.comment && !commentsSet[transaction.comment]) {
        commentsSet[transaction.comment] = true
        result.push(transaction.comment)
      }
    }

    return result
  }
}
