import { AccountDetailsDTO } from './AccountDetailsDTO'

export interface TransactionsAggregations {
  accountDetails: AccountDetailsDTO[]
  categories: string[]
  currencies: string[]
  payees: string[]
  comments: string[]
}
