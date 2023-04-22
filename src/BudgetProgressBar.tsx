import React from 'react'
import styled from 'styled-components'

interface Props {
  totalAmount: number
  spentAmount: number
}

const ProgressBarContainer = styled.div`
  display: flex;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
`

const ProfitBar = styled.div<{ width: number }>`
  width: ${({width}) => width * 100}%;
  background-color: #4ec56d;
`

const SpentBar = styled.div<{ width: number }>`
  width: ${({width}) => width * 100}%;
  background-color: #6097d9;
`

const RemainingBar = styled.div<{ width: number }>`
  width: ${({width}) => width * 100}%;
  background-color: #edf4ff;
`

const OverdraftBar = styled.div<{ width: number }>`
  width: ${({width}) => width * 100}%;
  background-color: #ff6741;
`

export default function BudgetProgressBar({ totalAmount, spentAmount }: Props) {
  let profitRatio = 0
  let remainingRatio = 0
  let spentRatio = 0
  let overdraftRatio = 0

  if (totalAmount === 0) {
    if (spentAmount === 0) {
      remainingRatio = 1
    } else if (spentAmount < 0) {
      profitRatio = 1
    } else {
      overdraftRatio = 1
    }
  } else {
    const maxAmount = Math.max(totalAmount, spentAmount, totalAmount - spentAmount)
    profitRatio = Math.max(-spentAmount / maxAmount, 0)
    spentRatio = Math.min(spentAmount / maxAmount)
    remainingRatio = Math.max((totalAmount - spentAmount) / maxAmount, 0)
    overdraftRatio = Math.max((spentAmount - totalAmount) / maxAmount, 0)
  }

  return (
    <ProgressBarContainer>
      {profitRatio > 0 && <ProfitBar width={profitRatio} />}
      {spentRatio > 0 && <SpentBar width={spentRatio} />}
      {remainingRatio > 0 && <RemainingBar width={remainingRatio} />}
      {overdraftRatio > 0 && <OverdraftBar width={overdraftRatio} />}
    </ProgressBarContainer>
  )
}
