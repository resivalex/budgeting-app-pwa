import React from 'react'
import styled from 'styled-components'

interface Props {
  totalAmount: number
  spentAmount: number
}

const ProgressBarContainer = styled.div`
  display: flex;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
`

const SpentBar = styled.div<{ width: number; isOverBudget: boolean }>`
  width: ${({width}) => width * 100}%;
  background-color: #7fd3b2;
`

const RemainingBar = styled.div<{ width: number }>`
  width: ${({width}) => width * 100}%;
  background-color: #e5e5e5;
`

const OverdraftBar = styled.div<{ width: number }>`
  width: ${({width}) => width * 100}%;
  background-color: #faa9a9;
`

export default function BudgetProgressBar({ totalAmount, spentAmount }: Props) {
  let remainingRatio = 0
  let spentRatio = 0
  let overdraftRatio = 0

  if (totalAmount === 0) {
    if (spentAmount === 0) {
      remainingRatio = 1
    } else {
      overdraftRatio = 1
    }
  } else {
    const maxAmount = Math.max(totalAmount, spentAmount)
    spentRatio = Math.min(spentAmount / maxAmount)
    remainingRatio = Math.max((totalAmount - spentAmount) / maxAmount, 0)
    overdraftRatio = Math.max((spentAmount - totalAmount) / maxAmount, 0)
  }

  return (
    <ProgressBarContainer>
      {spentRatio > 0 && <SpentBar width={spentRatio} isOverBudget={spentAmount > totalAmount} />}
      {remainingRatio > 0 && <RemainingBar width={remainingRatio} />}
      {overdraftRatio > 0 && <OverdraftBar width={overdraftRatio} />}
    </ProgressBarContainer>
  )
}
