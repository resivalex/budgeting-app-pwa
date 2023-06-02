import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'

interface Props {
  handleLogout: () => void
  handleExport: () => void
  appVersion: string
}

const Menu: React.FC<Props> = ({ handleLogout, handleExport, appVersion }) => {
  const [isMenuActive, setIsMenuActive] = useState(false)
  const menuRef: any = useRef(null)
  const burgerRef: any = useRef(null)
  const location = useLocation()

  function toggleMenu() {
    setIsMenuActive(!isMenuActive)
  }

  function closeMenu() {
    setIsMenuActive(false)
  }

  useEffect(() => {
    function handleClick(event: any) {
      if (!menuRef.current.contains(event.target) && burgerRef.current !== event.target) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [menuRef, burgerRef])

  return (
    <div className="navbar">
      <div className="navbar-brand">
        <a
          ref={burgerRef}
          role="button"
          className="navbar-burger"
          style={{ marginLeft: 0 }}
          onClick={(e) => {
            e.preventDefault()
            toggleMenu()
          }}
          href="/"
        >
          <span></span>
          <span></span>
          <span></span>
        </a>
      </div>
      <div
        ref={menuRef}
        style={{ position: 'absolute', width: '100%' }}
        className={classNames('navbar-menu', { 'is-active': isMenuActive })}
      >
        <div className="navbar-start">
          <Link
            to="/"
            className={classNames('navbar-item', { 'is-active': location.pathname === '/' })}
            onClick={toggleMenu}
            replace
          >
            Главная
          </Link>
          <Link
            to="/transactions"
            className={classNames('navbar-item', {
              'is-active': location.pathname === '/transactions',
            })}
            onClick={toggleMenu}
            replace
          >
            Записи
          </Link>
          <Link
            to="/budgets"
            className={classNames('navbar-item', {
              'is-active': location.pathname === '/budgets',
            })}
            onClick={toggleMenu}
            replace
          >
            Бюджеты
          </Link>
          <Link
            to="/add"
            className={classNames('navbar-item', {
              'is-active': location.pathname === '/add',
            })}
            onClick={toggleMenu}
            replace
          >
            Новая запись
          </Link>
          <div className="has-text-grey m-3">Версия: {appVersion}</div>
          <button onClick={handleExport} className="button is-info mt-1 ml-3">
            Экспорт
          </button>
          <button onClick={handleLogout} className="button is-danger mt-1 ml-3">
            Выйти
          </button>
        </div>
      </div>
    </div>
  )
}

export default Menu
