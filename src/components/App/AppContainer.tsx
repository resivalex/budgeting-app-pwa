import { useEffect, useState } from 'react'
import Login from './Login'
import { DbService, BackendService } from '@/services'
import AuthorizedAppContainer from './AuthorizedAppContainer'

type ConfigType = {
  backendUrl: string
  backendToken: string
  dbUrl: string
}

export default function AppContainer() {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [config, setConfig] = useState<ConfigType | null>(null)
  const [backendService, setBackendService] = useState<BackendService | null>(null)
  const [dbService, setDbService] = useState<DbService | null>(null)

  useEffect(() => {
    const localStorageConfig: ConfigType | null = localStorage.config
      ? JSON.parse(localStorage.config)
      : null
    setConfig(localStorageConfig)
  }, [isAuthenticated])

  useEffect(() => {
    if (config) {
      setIsAuthenticated(true)
    }
  }, [config])

  useEffect(() => {
    if (!config) {
      return
    }
    const service = new BackendService(config.backendUrl, config.backendToken)
    setBackendService(service)
  }, [config])

  useEffect(() => {
    if (!config) {
      return
    }
    const service = new DbService({
      dbUrl: config.dbUrl,
      onLoading: setIsLoading,
    })
    setDbService(service)
  }, [config])

  const handleSuccessfulLogin = () => {
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return <Login onSuccessfulLogin={handleSuccessfulLogin} />
  }

  if (!backendService) {
    return null
  }
  if (!dbService) {
    return null
  }
  return (
    <AuthorizedAppContainer
      backendService={backendService}
      dbService={dbService}
      isLoading={isLoading}
    />
  )
}
