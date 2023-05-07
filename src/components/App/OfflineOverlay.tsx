import React from 'react'
import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  pointer-events: none;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`

const OfflineText = styled.span`
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.5);
`

export default function OfflineOverlay() {
  return (
    <Overlay>
      <OfflineText>Offline</OfflineText>
    </Overlay>
  )
}
