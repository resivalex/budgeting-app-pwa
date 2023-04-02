import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'

type MenuProps = {
  handleLogout: () => void,
  offlineMode: boolean
}

const Menu: React.FC<MenuProps> = ({ handleLogout, offlineMode }) => {
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

  function handleClick(event: any) {
    if (!menuRef.current.contains(event.target) && burgerRef.current !== event.target) {
      closeMenu()
    }
  }

  useEffect(() => {
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
        {offlineMode && (
          <div className="is-text">
            <div>Offline</div>
            <div>mode</div>
          </div>
        )}
      </div>
      <div ref={menuRef} className={classNames('navbar-menu', { 'is-active': isMenuActive })}>
        <div className="navbar-start">
          <Link
            to="/"
            className={classNames('navbar-item', { 'is-active': location.pathname === '/' })}
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/transactions"
            className={classNames('navbar-item', {
              'is-active': location.pathname === '/transactions',
            })}
            onClick={toggleMenu}
          >
            Transactions
          </Link>
          <Link
            to="/add"
            className={classNames('navbar-item', {
              'is-active': location.pathname === '/add',
            })}
            onClick={toggleMenu}
          >
            Add
          </Link>
          <button onClick={handleLogout} className="button is-danger mt-1">
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Menu
