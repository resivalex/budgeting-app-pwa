import React, { useEffect, useState, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Status from './Status'
import Transactions from './Transactions'
import NotFound from './NotFound'
import TransactionForm from './TransactionForm'
import PouchDB from 'pouchdb'
import { TransactionDTO } from './Transaction'
import { v4 as uuidv4 } from 'uuid'
import Login from './Login'
import DbService from './DbService'
import TransactionAggregator from './TransactionAggregator'
import Menu from './Menu'

type ConfigType = {
  backendUrl: string
  backendToken: string
  dbUrl: string
}

export default function App() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMenuActive, setIsMenuActive] = useState(false)
  const menuRef: any = useRef(null)
  const burgerRef: any = useRef(null)

  function toggleMenu() {
    setIsMenuActive(!isMenuActive)
  }

  const getIsAuthenticated = () => {
    return localStorage.getItem('config') !== null
  }
  const isAuthenticated = getIsAuthenticated()
  const transactionAggregator = new TransactionAggregator(transactions)
  const accountAndCurrencies = transactionAggregator.getAccountAndCurrencies()
  const sortedCategories = transactionAggregator.getSortedCategories()

  const handleLogout = () => {
    localStorage.removeItem('config')
    window.location.reload()
  }

  useEffect(() => {
    async function loadTransactions() {
      if (!window.localStorage.config) {
        return
      }
      const config: ConfigType = JSON.parse(window.localStorage.config)
      const dbService = new DbService({
        dbUrl: config.dbUrl,
        onLoading: setIsLoading,
        onDocsRead: setTransactions,
        onError: setError,
      })
      await dbService.initialize()
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
          <Menu isMenuActive={isMenuActive} toggleMenu={toggleMenu} handleLogout={handleLogout} />{' '}
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
