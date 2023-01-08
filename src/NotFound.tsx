import React from 'react'
import { useLocation, Link } from 'react-router-dom'

export default function NotFound() {
  const location = useLocation()

  return (
    <div>
      <div>
        Page not found. Go to <Link to="/">Home</Link>.
      </div>
      Current location
      <pre>{JSON.stringify(location, null, 2)}</pre>
    </div>
  )
}
