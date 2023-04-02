import axios from 'axios'

export interface ConfigData {
  backendUrl: string
  backendToken: string
  dbUrl: string
}

export interface SettingsData {
  transactionsUploadedAt: string
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

  async getSettings(): Promise<any> {
    const response = await axios.get(`${this.backendUrl}/settings`, {
      params: { token: this.token },
    })

    return {
      transactionsUploadedAt: response.data.transactions_uploaded_at,
    }
  }
}

export default BackendService
