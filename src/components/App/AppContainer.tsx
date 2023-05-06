import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setIsAuthenticated, useAppSelector, AppState, setIsLoading } from '@/redux/appSlice'
import Login from './Login'
import { DbService, BackendService } from '@/services'
import AuthorizedAppContainer from './AuthorizedAppContainer'

type ConfigType = {
  backendUrl: string
  backendToken: string
  dbUrl: string
}

export default function AppContainer() {
  const dispatch = useDispatch()
  const isAuthenticated = useAppSelector((state: AppState) => state.isAuthenticated)
  const [config, setConfig] = useState<ConfigType | null>(null)
  const [backendService, setBackendService] = useState<BackendService | null>(null)
  const [dbService, setDbService] = useState<DbService | null>(null)

  useEffect(() => {
    const localStorageConfig: ConfigType | null = window.localStorage.config
      ? JSON.parse(window.localStorage.config)
      : null
    setConfig(localStorageConfig)
  }, [isAuthenticated])

  useEffect(() => {
    if (config) {
      dispatch(setIsAuthenticated(true))
    }
  }, [config, dispatch])

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
      onLoading: (value) => dispatch(setIsLoading(value)),
    })
    setDbService(service)
  }, [config, dispatch])

  const handleSetIsAuthenticated = (value: boolean) => {
    dispatch(setIsAuthenticated(value))
  }

  const handleSuccessfulLogin = () => {
    handleSetIsAuthenticated(true)
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
  return <AuthorizedAppContainer backendService={backendService} dbService={dbService} />
}
