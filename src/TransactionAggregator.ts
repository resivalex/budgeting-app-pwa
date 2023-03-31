export default class TransactionAggregator {
  transactions: any[]

  constructor(transactions: any[]) {
    this.transactions = transactions
  }

  getAccountDetails() {
    return this.transactions.reduce((accountCurrencies: any, transaction: any) => {
      if (!accountCurrencies[transaction.account]) {
        accountCurrencies[transaction.account] = {
          currency: transaction.currency,
          balance: 0,
        }
      }
      accountCurrencies[transaction.account].balance += transaction.amount

      return accountCurrencies
    }, {})
  }

  getSortedCategories() {
    const categoriesCounts = this.transactions.reduce((categories: any, transaction: any) => {
      if (!categories[transaction.category]) {
        categories[transaction.category] = 0
      }
      categories[transaction.category]++

      return categories
    }, {})

    return Object.keys(categoriesCounts).sort((a, b) => {
      return categoriesCounts[b] - categoriesCounts[a]
    })
  }

  getAccountAndCurrencies() {
    const accountDetails = this.getAccountDetails()
    return Object.keys(accountDetails).map((account) => {
      return {
        account: account,
        currency: accountDetails[account].currency,
      }
    })
  }
}
