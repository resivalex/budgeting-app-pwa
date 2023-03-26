import React, { useEffect, useState, useRef } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './Home'
import Status from './Status'
import Transactions from './Transactions'
import NotFound from './NotFound'
import classNames from 'classnames'
import TransactionForm from './TransactionForm'
import PouchDB from 'pouchdb'
import { TransactionDTO } from './Transaction'
import { v4 as uuidv4 } from 'uuid'
import Login from './Login'

type ConfigType = {
  backendUrl: string
  backendToken: string
  dbUrl: string
}

type AccountDetailsType = {
  currency: string
  balance: number
}

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMenuActive, setIsMenuActive] = useState(false)
  const menuRef: any = useRef(null)
  const burgerRef: any = useRef(null)
  const location = useLocation()

  function toggleMenu() {
    setIsMenuActive(!isMenuActive)
  }

  function closeMenu() {
    setIsMenuActive(false)
  }

  const getIsAuthenticated = () => {
    return localStorage.getItem('config') !== null
  }
  const isAuthenticated = getIsAuthenticated()
  const accountDetails: { [account: string]: AccountDetailsType } = transactions.reduce(
    (accountCurrencies: any, transaction: any) => {
      if (!accountCurrencies[transaction.account]) {
        accountCurrencies[transaction.account] = {
          currency: transaction.currency,
          balance: 0,
        }
      }
      accountCurrencies[transaction.account].balance += transaction.amount

      return accountCurrencies
    },
    {}
  )
  const accountAndCurrencies = Object.keys(accountDetails).map((account) => {
    return {
      account: account,
      currency: accountDetails[account].currency,
    }
  })
  // Make a list of all categories sorted from most common to least common
  const categoriesCounts = transactions.reduce((categories: any, transaction: any) => {
    if (!categories[transaction.category]) {
      categories[transaction.category] = 0
    }
    categories[transaction.category]++

    return categories
  }, {})
  const sortedCategories = Object.keys(categoriesCounts).sort((a, b) => {
    return categoriesCounts[b] - categoriesCounts[a]
  })

  const handleLogout = () => {
    localStorage.removeItem('config')
    window.location.reload()
  }

  useEffect(() => {
    function readAllDocs(db: any) {
      db.allDocs({
        include_docs: true,
      })
        .then(function (result: any) {
          // Extract the documents from the result
          const docs = result.rows.map((row: any) => row.doc)
          docs.sort((a: any, b: any) => (a.datetime > b.datetime ? -1 : 1))
          setTransactions(docs)
        })
        .catch(function (err: any) {
          setError(err)
        })
    }

    async function loadTransactions() {
      if (!window.localStorage.config) {
        return
      }
      const config: ConfigType = JSON.parse(window.localStorage.config)
      try {
        const localDB = new PouchDB('budgeting')
        const remoteDB = new PouchDB(config.dbUrl + '/budgeting')
        localDB
          .sync(remoteDB, {
            live: true,
            retry: true,
          })
          .on('change', (_info: any) => {
            console.log('DB change')
            setIsLoading(true)
          })
          .on('paused', (_err: any) => {
            console.log('DB paused')
            readAllDocs(localDB)
            setIsLoading(false)
          })
          .on('active', () => {
            console.log('DB active')
            setIsLoading(true)
          })
          .on('denied', (_err: any) => {
            console.log('DB denied')
            setIsLoading(false)
          })
          .on('complete', (_info: any) => {
            console.log('DB complete')
            setIsLoading(false)
          })
          .on('error', (_err: any) => {
            console.log('DB error')
            setIsLoading(false)
          })
      } catch (err: any) {
        setError(err.toString())
      }
    }
    void loadTransactions()
  }, [isAuthenticated])

  useEffect(() => {
    function handleClick(event: any) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        burgerRef.current !== event.target
      ) {
        setIsMenuActive(false)
      }
    }

    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [menuRef, burgerRef])

  function addTransaction(t: TransactionDTO) {
    const localDB = new PouchDB('budgeting')

    console.log(t)
    void localDB.put({ _id: uuidv4(), ...t })
  }

  return (
    <div>
      {isAuthenticated ? (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div className="navbar">
            <div className="navbar-brand">
              <a
                ref={burgerRef}
                role="button"
                className="navbar-burger"
                style={{ marginLeft: 0 }}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu()
                }}
                href="/"
              >
                <span></span>
                <span></span>
                <span></span>
              </a>
            </div>
            <div ref={menuRef} className={classNames('navbar-menu', { 'is-active': isMenuActive })}>
              <div className="navbar-start">
                <Link
                  to="/"
                  className={classNames('navbar-item', { 'is-active': location.pathname === '/' })}
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link
                  to="/transactions"
                  className={classNames('navbar-item', {
                    'is-active': location.pathname === '/transactions',
                  })}
                  onClick={closeMenu}
                >
                  Transactions
                </Link>
                <Link
                  to="/add"
                  className={classNames('navbar-item', {
                    'is-active': location.pathname === '/add',
                  })}
                  onClick={closeMenu}
                >
                  Add
                </Link>
                <button onClick={handleLogout} className="button is-danger mt-1">
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div
            style={{
              width: '100%',
              flex: 1,
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Routes>
              <Route path="/" element={<Home transactions={transactions} />} />
              <Route path="/transactions" element={<Transactions transactions={transactions} />} />
              <Route
                path="/add"
                element={
                  <TransactionForm
                    onAdd={addTransaction}
                    accounts={accountAndCurrencies}
                    categories={sortedCategories}
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Login />
      )}
      <Status isLoading={isLoading} error={error} onClose={() => setError('')} />
    </div>
  )
}
