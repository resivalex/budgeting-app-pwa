import createDBCallbacks from './dbCallbacks'
import { initializeLocalPouchDB, initializeRemotePouchDB } from './dbInitialization'
import { readAllDocs } from './dbQueries'
import { v4 as uuidv4 } from 'uuid'
import { TransactionDTO } from './Transaction'

interface DbServiceProps {
  dbUrl: string
  onLoading?: (isLoading: boolean) => void
  onDocsRead?: (docs: any[]) => void
  onError?: (error: any) => void
}

interface InitializeProps {
  shouldReset: () => Promise<boolean>
}

export default class DbService {
  private readonly dbUrl: string
  private readonly onLoading: (isLoading: boolean) => void
  private readonly onDocsRead: (docs: any[]) => void
  private readonly onError: (error: any) => void
  private localDB: any
  private remoteDB: any

  constructor(props: DbServiceProps) {
    this.dbUrl = props.dbUrl
    this.onLoading = props.onLoading || (() => {})
    this.onDocsRead = props.onDocsRead || (() => {})
    this.onError = props.onError || (() => {})

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

  async syncronize({ shouldReset }: InitializeProps) {
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
          try {
            const docs = await readAllDocs(this.localDB)
            this.onDocsRead(docs)
            if (await shouldReset()) {
              await this.reset()
              await this.syncronize({ shouldReset })
            }
          } catch (err) {
            this.onError(err)
          }
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
