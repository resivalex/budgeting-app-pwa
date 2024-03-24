import { TransactionDTO } from '@/types'
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
}

export default class DbService {
  private readonly dbUrl: string
  private readonly onLoading: (isLoading: boolean) => void
  private localDB: any
  private readonly remoteDB: any

  constructor(props: DbServiceProps) {
    this.dbUrl = props.dbUrl
    this.onLoading = props.onLoading || (() => {})

    this.localDB = initializeLocalPouchDB()
    this.remoteDB = initializeRemotePouchDB(this.dbUrl)
  }

  async reset() {
    await this.localDB.destroy()
    this.localDB = initializeLocalPouchDB()
  }

  async addTransaction(t: TransactionDTO) {
    await this.localDB.put(t)
  }

  async replaceTransaction(transaction: TransactionDTO) {
    const doc = await this.localDB.get(transaction._id)
    const updatedDoc = { ...doc, ...transaction }

    await this.localDB.put(updatedDoc)
  }

  async removeTransaction(id: string) {
    const doc = await this.localDB.get(id)
    await this.localDB.remove(doc)
  }

  async readAllDocs(): Promise<any[]> {
    console.log('readAllDocs')
    const result = await this.localDB.allDocs({ include_docs: true })
    return result.rows.map((row: any) => row.doc)
  }

  async pushChanges(): Promise<boolean> {
    console.log('pushChanges')
    this.onLoading(true)
    return new Promise<boolean>((resolve, reject) => {
      this.localDB.replicate
        .to(this.remoteDB, {
          live: false,
          retry: false,
        })
        .on('complete', () => {
          console.log('pushChanges complete')
          this.onLoading(false)
          resolve(true)
        })
        .on('error', (err: any) => {
          console.log('pushChanges error')
          this.onLoading(false)
          reject(err)
        })
    })
  }

  async pullChanges(): Promise<boolean> {
    this.onLoading(true)

    let hasChanges = false

    return new Promise<boolean>((resolve, reject) => {
      this.localDB.replicate
        .from(this.remoteDB, {
          live: false,
          retry: false,
        })
        .on('change', (info: any) => {
          if (info.docs_read > 0) {
            hasChanges = true
          }
        })
        .on('complete', () => {
          this.onLoading(false)
          resolve(hasChanges)
        })
        .on('error', (err: any) => {
          console.error('pullChanges error')
          this.onLoading(false)
          reject(err)
        })
    })
  }
}
