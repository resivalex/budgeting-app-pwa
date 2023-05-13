interface ConversionRate {
  currency: string
  rate: number
}

interface CurrencyConfig {
  mainCurrency: string
  conversionRates: ConversionRate[]
}

interface MonthSpendingLimit {
  date: string
  currency: string
  amount: number
}

interface SpendingLimit {
  name: string
  color: string
  categories: string[]
  monthLimits: MonthSpendingLimit[]
}

interface MonthCurrencyConfig {
  date: string
  config: CurrencyConfig
}

export interface SpendingLimitsDTO {
  limits: SpendingLimit[]
  monthCurrencyConfigs: MonthCurrencyConfig[]
}
