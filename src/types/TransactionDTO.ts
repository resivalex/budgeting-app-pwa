export interface TransactionDTO {
  _id: string
  datetime: string
  account: string
  category: string
  type: 'income' | 'expense' | 'transfer'
  amount: string
  currency: string
  payee: string
  comment: string
}
