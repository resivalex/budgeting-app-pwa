import React from 'react'

type HomeProps = {
  onLogout: () => void
}

export default function Home({ onLogout }: HomeProps) {
  return (
    <div className="box">
      <h1>Welcome to the Budgeting App!</h1>
      <button onClick={onLogout} className="button is-danger">
        Logout
      </button>
    </div>
  )
}
