import PouchDB from 'pouchdb'

export const initializePouchDB = (dbUrl: string) => {
  const localDB = new PouchDB('budgeting')
  const remoteDB = new PouchDB(dbUrl + '/budgeting')

  return { localDB, remoteDB }
}
