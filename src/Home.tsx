import React from 'react'

type Props = {
  error: string
  isLoading: boolean
}

export default function Home({ error, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="box">
        <div>Loading...</div>
      </div>
    )
  }
  return <div className="box">{error === '' ? <div>Loaded.</div> : <div className="has-text-danger">{error}</div>}</div>
}
