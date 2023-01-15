import React from 'react'
import classNames from 'classnames'

type Props = {
  error: string
  isLoading: boolean
  onClose: () => void
}

export default function Status({ error, isLoading, onClose }: Props) {
  return (
    <div className={classNames('modal', { 'is-active': isLoading || error })}>
      <div className="modal-background"></div>
      <div className="modal-content p-2">
        <div className="box">
          {isLoading && (
            <>
              <div className="is-size-6 pb-1">Sync...</div>
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
