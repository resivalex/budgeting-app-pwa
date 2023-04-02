import PouchDB from 'pouchdb'

export const initializeLocalPouchDB = () => {
  return new PouchDB('budgeting')
}

export const initializeRemotePouchDB = (dbUrl: string) => {
  return new PouchDB(dbUrl + '/budgeting')
}
