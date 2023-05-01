import React from 'react'
import { useLocation, Link } from 'react-router-dom'

export default function NotFound() {
  const location = useLocation()

  return (
    <div>
      <div>
        Страница не найдена. Перейти на{' '}
        <Link to="/" replace>
          Главную
        </Link>
        .
      </div>
      Вы находитесь
      <pre>{JSON.stringify(location, null, 2)}</pre>
    </div>
  )
}
