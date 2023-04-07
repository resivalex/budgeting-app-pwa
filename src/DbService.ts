import createDBCallbacks from './dbCallbacks'
import { initializeLocalPouchDB, initializeRemotePouchDB } from './dbInitialization'
import { v4 as uuidv4 } from 'uuid'
import { TransactionDTO } from './Transaction'
import _ from 'lodash'

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
    console.log('DbService constructor')
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
    console.log(t)
    await this.localDB.put({ _id: uuidv4(), ...t })
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
          docs.sort((a: any, b: any) => (a.datetime > b.datetime ? -1 : 1))
          resolve(docs)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }

  async readDocs() {
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
