import React, { useState, useEffect, useCallback } from 'react'
import BackendService, { ConfigData } from './BackendService'

type Props = {
  onSuccessfulLogin: () => void
}

export default function Login({ onSuccessfulLogin }: Props) {
  const [backendUrl, setBackendUrl] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onLoginSuccess = useCallback(() => {
    onSuccessfulLogin()
  }, [onSuccessfulLogin])

  useEffect(() => {
    if (localStorage.getItem('config')) {
      onLoginSuccess()
    }
  }, [onLoginSuccess])

  const handleInputChange = () => {
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const backendService = new BackendService(backendUrl)
      const config: ConfigData = await backendService.getConfig(password)

      window.localStorage.config = JSON.stringify(config)
      onLoginSuccess()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="container p-2">
      <h1 className="title is-4">Login</h1>
      {error && <div className="notification is-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="backendUrl" className="label">
            Backend URL:
          </label>
          <div className="control">
            <input
              type="text"
              id="backendUrl"
              className="input"
              value={backendUrl}
              onChange={(e) => {
                setBackendUrl(e.target.value)
                handleInputChange()
              }}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="password" className="label">
            Password:
          </label>
          <div className="control">
            <input
              type="password"
              id="password"
              className="input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                handleInputChange()
              }}
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button type="submit" className="button is-info">
              Log In
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
