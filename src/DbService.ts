import createDBCallbacks from './dbCallbacks'
import { initializePouchDB } from './dbInitialization'
import { readAllDocs } from './dbQueries'

interface DbServiceProps {
  dbUrl: string
  onLoading?: (isLoading: boolean) => void
  onDocsRead?: (docs: any[]) => void
  onError?: (error: any) => void
}

export default class DbService {
  private readonly dbUrl: string
  private readonly onLoading: (isLoading: boolean) => void
  private readonly onDocsRead: (docs: any[]) => void
  private readonly onError: (error: any) => void

  constructor(props: DbServiceProps) {
    this.dbUrl = props.dbUrl
    this.onLoading = props.onLoading || (() => {})
    this.onDocsRead = props.onDocsRead || (() => {})
    this.onError = props.onError || (() => {})
  }

  async initialize() {
    const dbCallbacks = createDBCallbacks(this.onLoading)

    try {
      const { localDB, remoteDB } = initializePouchDB(this.dbUrl)
      localDB
        .sync(remoteDB, {
          live: true,
          retry: true,
        })
        .on('change', dbCallbacks.handleDBChange)
        .on('paused', async () => {
          dbCallbacks.handleDBPaused()
          try {
            const docs = await readAllDocs(localDB)
            this.onDocsRead(docs)
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
