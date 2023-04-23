import React, { useRef, useState, useEffect } from 'react'
import Transaction, { TransactionDTO } from './Transaction'
import { List, AutoSizer } from 'react-virtualized'
import TransactionInfoModal from './TransactionInfoModal'

interface Props {
  transactions: TransactionDTO[]
  focusedTransaction?: TransactionDTO
  onRemove: (id: string) => void
  onEdit: (id: string) => void
  onFocus: (id: string) => void
}

export default function Transactions({
  transactions,
  focusedTransaction,
  onRemove,
  onEdit,
  onFocus,
}: Props) {
  const [heights, setHeights] = useState<any>({})
  const listRef: any = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.recomputeRowHeights(0)
    }
  }, [transactions, heights])

  if (transactions.length === 0) {
    return <div className="box">Empty</div>
  }

  const rowRenderer = ({ index, key, style }: any) => {
    const transaction = transactions[index]
    return (
      <div key={key} style={style}>
        <Transaction
          key={index}
          t={transaction}
          onDimensionsChange={(dimensions: any) => {
            setHeights((prevHeights: any) => {
              return { ...prevHeights, [index]: dimensions.height }
            })
          }}
          onLongPress={() => {
            onFocus(transaction._id)
          }}
        />
      </div>
    )
  }

  return (
    <div style={{ flex: 1 }}>
      {
        // @ts-ignore
        <AutoSizer>
          {({ height, width }: any) => (
            // @ts-ignore
            <List
              ref={listRef}
              height={height}
              rowCount={transactions.length}
              rowHeight={({ index }) => {
                if (heights[index]) {
                  return heights[index]
                }
                return 80
              }}
              rowRenderer={rowRenderer}
              width={width}
            />
          )}
        </AutoSizer>
      }
      {focusedTransaction && (
        <TransactionInfoModal
          transaction={focusedTransaction}
          onClose={() => onFocus('')}
          onRemove={() => {
            onFocus('')
            onRemove(focusedTransaction._id)
          }}
          onEdit={onEdit}
        />
      )}
    </div>
  )
}
