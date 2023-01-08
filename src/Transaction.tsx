import { Text, Box, Flex } from 'native-base'
import React from 'react'

class TransactionDTO {
  datetime!: string
  account!: string
  category!: string
  type!: 'income' | 'expense' | 'transfer'
  amount!: string
  currency!: string
  payee!: string
  comment!: string
}

export default function ({ t }: { t: TransactionDTO }) {
  return (
    <Box>
      <Flex direction="row" alignItems="flex-start" justifyContent="space-between">
        <Flex direction="column" justifyContent="space-between">
          <Text>{t.account}</Text>
          <Text>{t.category}</Text>
        </Flex>
        <Flex direction="column" justifyContent="space-between">
          {t.amount}
        </Flex>
      </Flex>
      <Flex direction="row" justifyContent="space-between">
        <Box>
          {t.payee && <Text>{t.payee}</Text>}
          {t.comment && <Text>{t.comment}</Text>}
        </Box>
        <Text textAlign="right">{t.datetime}</Text>
      </Flex>
    </Box>
  )
}
