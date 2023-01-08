import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from './logo.svg'
import './App.css'
import axios from 'axios'
import Transaction from './Transaction'

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')

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
    <>
      <div id="sidebar">
        <h1>Transactions</h1>
        <div>{error !== '' && error}</div>
        {transactions.length === 0 ? 'Empty' : null}
        {transactions.map((transaction: any, index: number) => {
          return <Transaction key={index} t={transaction}></Transaction>
        })}
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input id="q" aria-label="Search contacts" placeholder="Search" type="search" name="q" />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </form>
          <form method="post">
            <button type="submit">New</button>
          </form>
        </div>
        <nav>
          <ul>
            <li>
              <Link to={`contacts/1`}>Your Name</Link>
            </li>
            <li>
              <Link to={`contacts/2`}>Your Friend</Link>
            </li>
            <li>
              <Link to={`about`}>About</Link>
            </li>
            <li>
              <Link to={`home`}>Home</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail"></div>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header>
      </div>
    </>
  )
}
