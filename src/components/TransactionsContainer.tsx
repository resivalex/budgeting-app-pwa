import React, { useEffect } from 'react'
import Transactions from './Transactions'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  setTransactions,
  useTransactionsSelect,
  setFocusedTransactionId,
} from '../redux/transactionsSlice'
import { TransactionDTO } from '../types'

interface Props {
  transactions: any[]
  onRemove: (id: string) => void
}

export default function TransactionsContainer({ transactions, onRemove }: Props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const storeTransactions: TransactionDTO[] = useTransactionsSelect((state) => state.transactions)
  const focusedTransactionId = useTransactionsSelect((state) => state.focusedTransactionId)

  const focusedTransaction = storeTransactions.find(
    (transaction) => transaction._id === focusedTransactionId
  )

  useEffect(() => {
    dispatch(setTransactions(transactions))
  }, [dispatch, transactions])

  function handleEdit(id: string) {
    navigate(`/transactions/${id}`, { replace: true })
  }

  return (
    <Transactions
      transactions={storeTransactions}
      focusedTransaction={focusedTransaction}
      onRemove={onRemove}
      onEdit={handleEdit}
      onFocus={(id: string) => dispatch(setFocusedTransactionId(id))}
    />
  )
}
