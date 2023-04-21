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

export interface SpendingLimit {
  name: string
  currency: string
  amount: number
  categories: string[]
}

export interface SpendingLimits {
  limits: SpendingLimit[]
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
      params: { token: this.token },
    })

    return {
      transactionsUploadedAt: response.data.transactions_uploaded_at,
    }
  }

  async getCurrencyConfig(): Promise<CurrencyConfig> {
    const response = await axios.get(`${this.backendUrl}/currency_config`, {
      params: { token: this.token },
    })

    const data = response.data

    return {
      mainCurrency: data.main_currency,
      conversionRates: data.conversion_rates,
    }
  }

  async getSpendingLimits(): Promise<SpendingLimits> {
    const response = await axios.get(`${this.backendUrl}/spending_limits`, {
      params: { token: this.token },
    })

    return response.data
  }
}

export default BackendService
