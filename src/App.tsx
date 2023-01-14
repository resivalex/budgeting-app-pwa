import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './Home'
import Transactions from './Transactions'
import NotFound from './NotFound'
import classNames from 'classnames'
import Config from './Config'
import PouchDB from 'pouchdb'

type ConfigType = {
  backendUrl: string
  backendToken: string
  dbUrl: string
}

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
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
          .on('change', (info: any) => {
            console.log('DB change', info)
          })
          .on('paused', (err: any) => {
            console.log('DB paused', err)
          })
          .on('active', () => {
            console.log('DB active')
          })
          .on('denied', (err: any) => {
            console.log('DB denied', err)
          })
          .on('complete', (info: any) => {
            console.log('DB complete', info)
          })
          .on('error', (err: any) => {
            console.log('DB error', err)
          })

        localDB
          .allDocs({
            include_docs: true,
          })
          .then(function (result: any) {
            // Extract the documents from the result
            const docs = result.rows.map((row: any) => row.doc)
            setTransactions(docs)
          })
          .catch(function (err: any) {
            setError(err)
          })
      } catch (err: any) {
        setError(err.toString())
      } finally {
        setIsLoading(false)
      }
    }
    void loadTransactions()
  }, [])

  return (
    <div>
      <div className="navbar is-fixed-top">
        <div className="tabs is-centered">
          <ul>
            <li className={classNames({ 'is-active': location.pathname === '/' })}>
              <Link to="/">Home</Link>
            </li>
            <li className={classNames({ 'is-active': location.pathname === '/transactions' })}>
              <Link to="/transactions">Transactions{!isLoading && !error ? ' (' + transactions.length + ')' : ''}</Link>
            </li>
            <li className={classNames({ 'is-active': location.pathname === '/config' })}>
              <Link to="/config">Config</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="pt-6">
        <Routes>
          <Route path="/" element={<Home isLoading={isLoading} error={error} />} />
          <Route path="/transactions" element={<Transactions transactions={transactions} />} />
          <Route path="/config" element={<Config onChange={(config) => (window.localStorage.config = config)} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}
