// Transactions.tsx
import React, { useRef, useState, useEffect } from 'react'
import Transaction from './Transaction'
import { List, AutoSizer } from 'react-virtualized'
import TransactionInfoModal from './TransactionInfoModal'

interface Props {
  transactions: any[]
  onRemove: (id: string) => void
  onEdit: (id: string) => void
}

export default function Transactions({ transactions, onRemove, onEdit }: Props) {
  const [heights, setHeights] = useState<any>({})
  const [focusedTransaction, setFocusedTransaction] = useState<any>(null)
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
            setFocusedTransaction(transaction)
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
          onClose={() => setFocusedTransaction(null)}
          onRemove={() => {
            setFocusedTransaction(null)
            onRemove(focusedTransaction._id)
          }}
          onEdit={onEdit}
        />
      )}
    </div>
  )
}
