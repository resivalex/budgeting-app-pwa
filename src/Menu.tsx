import React, { useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'

type MenuProps = {
  isMenuActive: boolean
  toggleMenu: () => void
  handleLogout: () => void
}

const Menu: React.FC<MenuProps> = ({ isMenuActive, toggleMenu, handleLogout }) => {
  const menuRef: any = useRef(null)
  const burgerRef: any = useRef(null)
  const location = useLocation()

  function closeMenu() {
    toggleMenu()
  }

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
      <div ref={menuRef} className={classNames('navbar-menu', { 'is-active': isMenuActive })}>
        <div className="navbar-start">
          <Link
            to="/"
            className={classNames('navbar-item', { 'is-active': location.pathname === '/' })}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/transactions"
            className={classNames('navbar-item', {
              'is-active': location.pathname === '/transactions',
            })}
            onClick={closeMenu}
          >
            Transactions
          </Link>
          <Link
            to="/add"
            className={classNames('navbar-item', {
              'is-active': location.pathname === '/add',
            })}
            onClick={closeMenu}
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
