import React from 'react'
import Measure from 'react-measure'
import { convertToLocaleTime } from '@/utils'
import { useLongPress, LongPressDetectEvents } from 'use-long-press'
import dayjs from 'dayjs'
import ruLocale from 'dayjs/locale/ru'
import { TransactionDTO } from '@/types'
import TransactionContent from './TransactionContent'

dayjs.locale(ruLocale)

interface Props {
  t: TransactionDTO
  hasDateHeader?: boolean
  onDimensionsChange: any
  onLongPress: () => void
}

export default function TransactionTile({
  t,
  hasDateHeader,
  onDimensionsChange,
  onLongPress,
}: Props) {
  const longPressBind = useLongPress(onLongPress, {
    onFinish: onLongPress,
    threshold: 500,
    captureEvent: true,
    cancelOnMovement: true,
    detect: LongPressDetectEvents.BOTH,
  })

  return (
    // @ts-ignore
    <Measure
      bounds
      onResize={(contentRect: any) => {
        onDimensionsChange({
          width: contentRect.bounds?.width || 300,
          height: contentRect.bounds?.height || 100,
        })
      }}
    >
      {({ measureRef }: any) => {
        const datetimeString = convertToLocaleTime(t.datetime)
        const currentDate = dayjs(datetimeString)

        const formattedDate = currentDate.format('D MMMM YYYY, dddd')
        return (
          <div ref={measureRef}>
            {hasDateHeader && (
              <div className="has-text-weight-semibold py-1 px-3" style={{ background: '#f3f3f3' }}>
                {formattedDate}
              </div>
            )}
            <div {...longPressBind()} className="box m-0 is-flex">
              <TransactionContent
                category={t.category}
                account={t.account}
                payee={t.payee}
                comment={t.comment}
                type={t.type}
                amount={t.amount}
                currency={t.currency}
                localTime={datetimeString.split(' ')[1]}
              />
            </div>
          </div>
        )
      }}
    </Measure>
  )
}
