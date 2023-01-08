import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import Home from './Home'
import Transactions from './Transactions'
import NotFound from './NotFound'
import classNames from 'classnames'

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')
  const location = useLocation()

  useEffect(() => {
    async function logTransactions() {
      try {
        const response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/transactions')
        setTransactions(response.data)
      } catch (err: any) {
        setError(err.toString())
      }
    }
    void logTransactions()
  }, [])

  return (
    <div>
      <div>{error !== '' && error}</div>
      <div className="tabs is-centered">
        <ul>
          <li className={classNames({ 'is-active': location.pathname === '/' })}>
            <Link to="/">Home</Link>
          </li>
          <li className={classNames({ 'is-active': location.pathname === '/transactions' })}>
            <Link to="/transactions">Transactions</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route path="/" element={<Home transactions={transactions} />} />
        <Route path="/transactions" element={<Transactions transactions={transactions} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
