import axios from 'axios'

export interface ConfigData {
  backendUrl: string
  backendToken: string
  dbUrl: string
}

export interface SettingsData {
  transactionsUploadedAt: string
}

export interface ConversionRate {
  currency: string
  rate: number
}

export interface CurrencyConfig {
  mainCurrency: string
  conversionRates: ConversionRate[]
}

export interface MonthSpendingLimit {
  date: string
  currency: string
  amount: number
}

export interface SpendingLimit {
  name: string
  categories: string[]
  monthLimits: MonthSpendingLimit[]
}

export interface MonthCurrencyConfig {
  date: string
  config: CurrencyConfig
}

export interface SpendingLimits {
  limits: SpendingLimit[]
  monthCurrencyConfigs: MonthCurrencyConfig[]
}

export interface CategoryExpansion {
  name: string
  expandedName: string
}

export interface CategoryExpansions {
  expansions: CategoryExpansion[]
}

class BackendService {
  private readonly backendUrl: string
  private readonly token?: string

  constructor(backendUrl: string, token?: string) {
    this.backendUrl = backendUrl
    this.token = token
  }

  async getConfig(password: string): Promise<ConfigData> {
    try {
      const response = await axios.get(`${this.backendUrl}/config`, {
        params: { password: password },
      })

      return {
        backendUrl: this.backendUrl,
        backendToken: response.data.backend_token,
        dbUrl: response.data.db_url,
      }
    } catch (err) {
      throw new Error('Failed to log in. Please check your Backend URL and Password.')
    }
  }

  async getSettings(): Promise<SettingsData> {
    const response = await axios.get(`${this.backendUrl}/settings`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })

    return {
      transactionsUploadedAt: response.data.transactions_uploaded_at,
    }
  }

  async getSpendingLimits(): Promise<SpendingLimits> {
    const response = await axios.get(`${this.backendUrl}/spending_limits`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })

    const data = response.data
    return {
      limits: data.limits.map((limit: any) => ({
        name: limit.name,
        categories: limit.categories,
        monthLimits: limit.month_limits.map((monthLimit: any) => ({
          date: monthLimit.date,
          currency: monthLimit.currency,
          amount: monthLimit.amount,
        })),
      })),
      monthCurrencyConfigs: data.month_currency_configs.map((monthCurrencyConfig: any) => ({
        date: monthCurrencyConfig.date,
        config: {
          mainCurrency: monthCurrencyConfig.config.main_currency,
          conversionRates: monthCurrencyConfig.config.conversion_rates,
        },
      })),
    }
  }

  async getCategoryExpansions(): Promise<CategoryExpansions> {
    const response = await axios.get(`${this.backendUrl}/category_expansions`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })

    return response.data
  }
}

export default BackendService
