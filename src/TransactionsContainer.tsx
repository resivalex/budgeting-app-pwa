import React, { useEffect } from 'react'
import Transactions from './Transactions'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setTransactions, useTransactionsSelect } from './redux/transactionsSlice'

interface Props {
  transactions: any[]
  onRemove: (id: string) => void
}

export default function TransactionsContainer({ transactions, onRemove }: Props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const storeTransactions = useTransactionsSelect((state) => state.transactions)

  useEffect(() => {
    dispatch(setTransactions(transactions))
  }, [dispatch, transactions])

  function handleEdit(id: string) {
    navigate(`/transactions/${id}`, { replace: true })
  }

  return <Transactions transactions={storeTransactions} onRemove={onRemove} onEdit={handleEdit} />
}
