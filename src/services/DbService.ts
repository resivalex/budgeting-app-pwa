import createDBCallbacks from './dbCallbacks'
import { TransactionDTO } from '@/types'
import _ from 'lodash'
import PouchDB from 'pouchdb'

function initializeLocalPouchDB() {
  return new PouchDB('budgeting')
}

function initializeRemotePouchDB(dbUrl: string) {
  return new PouchDB(dbUrl + '/budgeting')
}

interface DbServiceProps {
  dbUrl: string
  onLoading?: (isLoading: boolean) => void
  onDocsRead?: (docs: any[]) => void
  onError?: (error: any) => void
  shouldReset?: () => Promise<boolean>
}

export default class DbService {
  private readonly dbUrl: string
  private readonly onLoading: (isLoading: boolean) => void
  private readonly onDocsRead: (docs: any[]) => void
  private readonly onError: (error: any) => void
  private localDB: any
  private remoteDB: any
  private shouldReset: () => Promise<boolean>
  private debouncedReadAllDocs: () => void

  constructor(props: DbServiceProps) {
    this.dbUrl = props.dbUrl
    this.onLoading = props.onLoading || (() => {})
    this.onDocsRead = props.onDocsRead || (() => {})
    this.onError = props.onError || (() => {})
    this.shouldReset = props.shouldReset || (() => Promise.resolve(false))
    this.debouncedReadAllDocs = _.debounce(this.readDocs, 1000, {
      leading: false,
      trailing: true,
      maxWait: 5000,
    })

    this.localDB = initializeLocalPouchDB()
    this.remoteDB = initializeRemotePouchDB(this.dbUrl)
  }

  async reset() {
    await this.localDB.destroy()
    this.localDB = initializeLocalPouchDB()
  }

  async addTransaction(t: TransactionDTO) {
    try {
      await this.localDB.put(t)
    } catch (err) {
      this.onError(err)
    }
  }

  async replaceTransaction(transaction: TransactionDTO) {
    try {
      const doc = await this.localDB.get(transaction._id)
      const updatedDoc = { ...doc, ...transaction }

      await this.localDB.put(updatedDoc)
    } catch (err) {
      this.onError(err)
    }
  }

  async removeTransaction(id: string) {
    const doc = await this.localDB.get(id)
    await this.localDB.remove(doc)
  }

  async readAllDocs(): Promise<any[]> {
    console.log('readAllDocs')
    return new Promise((resolve, reject) => {
      this.localDB
        .allDocs({
          include_docs: true,
        })
        .then((result: any) => {
          // Extract the documents from the result
          const docs = result.rows.map((row: any) => row.doc)
          resolve(docs)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }

  private async readDocs() {
    try {
      const docs = await this.readAllDocs()
      this.onDocsRead(docs)
    } catch (err) {
      this.onError(err)
    }
  }

  async synchronize() {
    const dbCallbacks = createDBCallbacks(this.onLoading)

    try {
      this.localDB
        .sync(this.remoteDB, {
          live: true,
          retry: true,
        })
        .on('change', dbCallbacks.handleDBChange)
        .on('paused', async () => {
          dbCallbacks.handleDBPaused()
          if (await this.shouldReset()) {
            await this.reset()
            await this.synchronize()
          }
          this.debouncedReadAllDocs()
        })
        .on('active', dbCallbacks.handleDBActive)
        .on('denied', dbCallbacks.handleDBDenied)
        .on('complete', dbCallbacks.handleDBComplete)
        .on('error', dbCallbacks.handleDBError)
    } catch (err: any) {
      this.onError(err.toString())
    }
  }
}
