export function readAllDocs(db: any): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.allDocs({
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
