import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const [backendUrl, setBackendUrl] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (localStorage.getItem('config')) {
      setLoggedIn(true)
    }
  }, [])

  const handleInputChange = () => {
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.get(`${backendUrl}/config`, {
        params: { password: password },
      })

      if (response.status === 200) {
        localStorage.setItem(
          'config',
          JSON.stringify({
            backendUrl: backendUrl,
            backendToken: response.data.backend_token,
            dbUrl: response.data.db_url,
          })
        )
        setLoggedIn(true)
      }
    } catch (err) {
      setError('Failed to log in. Please check your Backend URL and Password.')
    }
  }

  if (loggedIn) {
    return <Navigate to="/" />
  }

  return (
    <div className="login-container container">
      <h1 className="title">Login</h1>
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
            <button type="submit" className="button">
              Log In
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
