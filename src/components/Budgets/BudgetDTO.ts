import { TransactionDTO } from '@/types'

export type BudgetDTO = {
  name: string
  color: string
  currency: string
  amount: number
  categories: string[]
  transactions: TransactionDTO[]
  spentAmount: number
  isEditable: boolean
}
