import axios from 'axios'

export interface ConfigData {
  backendUrl: string
  backendToken: string
  dbUrl: string
}

class BackendService {
  private readonly backendUrl: string

  constructor(backendUrl: string) {
    this.backendUrl = backendUrl
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
}

export default BackendService
