import axios from 'axios'
import {
  ConfigDataDTO,
  SpendingLimitsDTO,
  CategoryExpansionsDTO,
  AccountPropertiesDTO,
} from '@/types'

interface SettingsData {
  transactionsUploadedAt: string
}

class BackendService {
  private readonly backendUrl: string
  private readonly token?: string

  constructor(backendUrl: string, token?: string) {
    this.backendUrl = backendUrl
    this.token = token
  }

  async getConfig(password: string): Promise<ConfigDataDTO> {
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

  async getSpendingLimits(): Promise<SpendingLimitsDTO> {
    const response = await axios.get(`${this.backendUrl}/spending-limits`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })

    const data = response.data
    return {
      limits: data.limits.map((limit: any) => ({
        name: limit.name,
        color: limit.color,
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

  async setMonthSpendingItemLimit(date: string, name: string, currency: string, amount: number): Promise<void> {
    await axios.post(
      `${this.backendUrl}/spending-limits/month-budget-item`,
      { date: date, limit:{ name: name, currency: currency, amount: amount }},
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    )
  }

  async getCategoryExpansions(): Promise<CategoryExpansionsDTO> {
    const response = await axios.get(`${this.backendUrl}/category-expansions`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })

    return response.data
  }

  async getAccountProperties(): Promise<AccountPropertiesDTO> {
    const response = await axios.get(`${this.backendUrl}/account-properties`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })

    return response.data
  }

  async getExportingCsvString(): Promise<string> {
    try {
      const response = await axios.get(`${this.backendUrl}/exporting`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${this.token}` },
      })

      return response.data
    } catch (err) {
      throw new Error('Failed to export CSV.')
    }
  }
}

export default BackendService
