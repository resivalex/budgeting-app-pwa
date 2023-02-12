import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './Home'
import Status from './Status'
import Transactions from './Transactions'
import NotFound from './NotFound'
import classNames from 'classnames'
import Config from './Config'
import TransactionForm from './TransactionForm'
import PouchDB from 'pouchdb'
import { TransactionDTO } from './Transaction'
import { v4 as uuidv4 } from 'uuid'

type ConfigType = {
  backendUrl: string
  backendToken: string
  dbUrl: string
}

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()

  function saveConfig(config: string) {
    window.localStorage.config = config
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
  }, [])

  function addTransaction(t: TransactionDTO) {
    const localDB = new PouchDB('budgeting')

    console.log(t)
    void localDB.put({ _id: uuidv4(), ...t })
  }

  return (
    <div>
      <div className="navbar is-fixed-top">
        <div className="tabs is-centered">
          <ul>
            <li className={classNames({ 'is-active': location.pathname === '/' })}>
              <Link to="/">Home</Link>
            </li>
            <li className={classNames({ 'is-active': location.pathname === '/transactions' })}>
              <Link to="/transactions">
                Transactions{!isLoading && !error ? ' (' + transactions.length + ')' : ''}
              </Link>
            </li>
            <li className={classNames({ 'is-active': location.pathname === '/config' })}>
              <Link to="/config">Config</Link>
            </li>
            <li className={classNames({ 'is-active': location.pathname === '/add' })}>
              <Link to="/add">Add</Link>
            </li>
          </ul>
        </div>
      </div>
      <Status isLoading={isLoading} error={error} onClose={() => setError('')} />
      <div className="pt-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<Transactions transactions={transactions} />} />
          <Route path="/config" element={<Config onChange={saveConfig} />} />
          <Route path="/add" element={<TransactionForm onAdd={addTransaction} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}
