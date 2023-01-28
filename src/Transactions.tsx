import React, { useRef, useState } from 'react'
import Transaction from './Transaction'
import { List, AutoSizer } from 'react-virtualized'

export default function Transactions({ transactions }: { transactions: any[] }) {
  const [heights, setHeights] = useState<any>({})
  const listRef: any = useRef(null)

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
          onDimentionsChange={(dimensions: any) => {
            heights[index] = dimensions.height
            setHeights(heights)
          }}
        />
      </div>
    )
  }

  const handleMeasure = () => {
    listRef.current.recomputeRowHeights(0)
  }

  return (
    <div style={{ height: '100vh' }}>
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
              onRowsRendered={() => {
                handleMeasure()
              }}
            />
          )}
        </AutoSizer>
      }
    </div>
  )
}
