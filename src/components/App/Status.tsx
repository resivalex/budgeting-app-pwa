import React from 'react'

interface Props {
  isLoading: boolean
}

export default function Status({ isLoading }: Props) {
  if (!isLoading) {
    return null
  }

  return (
    <progress
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '5px',
        zIndex: 1000,
        borderRadius: 0,
      }}
      className="progress is-info"
      max="100"
    >
      15%
    </progress>
  )
}
