import React from 'react'
import classNames from 'classnames'

interface Props {
  error: string
  isLoading: boolean
  onClose: () => void
}

export default function Status({ error, isLoading, onClose }: Props) {
  const visible = isLoading || error

  if (!visible) {
    return null
  }

  return (
    <div className={classNames('modal', { 'is-active': visible })}>
      <div className="modal-background" style={{ backgroundColor: 'rgba(255, 255, 255)' }}></div>
      <div
        className="modal-content"
        style={{
          position: 'fixed',
          top: 0,
          margin: '1.5rem',
          maxHeight: 'calc(100% - 3rem)',
          overflowY: 'auto',
        }}
      >
        <div className="box">
          {isLoading && (
            <>
              <div className="is-size-6 pb-1 has-text-centered">Loading...</div>
              <progress className="progress is-info" max="100">
                15%
              </progress>
            </>
          )}
          {error && <div className="is-size-6 has-text-danger">{error}</div>}
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
    </div>
  )
}
