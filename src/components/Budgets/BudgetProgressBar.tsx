import React from 'react'
import styled from 'styled-components'

interface Props {
  totalAmount: number
  spentAmount: number
  externalRatio: number | null
}

const ProgressBarWrapper = styled.div`
  position: relative;
`

const ProgressBarContainer = styled.div`
  display: flex;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
`

const ProfitBar = styled.div<{ width: number }>`
  width: ${({ width }) => width * 100}%;
  background-color: #4ec56d;
`

const SpentBar = styled.div<{ width: number }>`
  width: ${({ width }) => width * 100}%;
  background-color: #6097d9;
`

const RemainingBar = styled.div<{ width: number }>`
  width: ${({ width }) => width * 100}%;
  background-color: #edf4ff;
`

const OverdraftBar = styled.div<{ width: number }>`
  width: ${({ width }) => width * 100}%;
  background-color: #ff6741;
`

const ExternalRatioBar = styled.div<{ left: number }>`
  position: absolute;
  top: -4px;
  bottom: -4px;
  width: 1px;
  left: ${({ left }) => left * 100}%;
  background-color: #000000;
  opacity: 0.3;
`

export default function BudgetProgressBar({ totalAmount, spentAmount, externalRatio }: Props) {
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
    spentRatio = Math.min(spentAmount, totalAmount) / maxAmount
    remainingRatio = Math.max((totalAmount - spentAmount) / maxAmount, 0)
    overdraftRatio = Math.max((spentAmount - totalAmount) / maxAmount, 0)
  }

  return (
    <ProgressBarWrapper>
      <ProgressBarContainer>
        {profitRatio > 0 && <ProfitBar width={profitRatio} />}
        {spentRatio > 0 && <SpentBar width={spentRatio} />}
        {remainingRatio > 0 && <RemainingBar width={remainingRatio} />}
        {overdraftRatio > 0 && <OverdraftBar width={overdraftRatio} />}
      </ProgressBarContainer>
      {externalRatio !== null && <ExternalRatioBar left={externalRatio} />}
    </ProgressBarWrapper>
  )
}
