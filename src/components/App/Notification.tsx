import React, { useEffect } from 'react'

interface NotificationProps {
  message: string
  type: string
  duration: number
  onDismiss: () => void
}

const Notification: React.FC<NotificationProps> = ({ message, type, duration, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss()
    }, duration)

    return () => {
      clearTimeout(timer)
    }
  }, [duration, onDismiss])

  return (
    <div
      className="level m-2"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        justifyContent: 'flex-end',
      }}
    >
      <div className={`notification ${type} level-item`}>
        <button className="delete" onClick={onDismiss}></button>
        {message}
      </div>
    </div>
  )
}

export default Notification
