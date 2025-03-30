import { useEffect, useRef } from 'react'

export function useInterval(
  callback: () => void,
  initialDelay: number,
  delay: number,
  dependency: any
) {
  const intervalRef = useRef<NodeJS.Timer | null>(null)

  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(callback, delay)
    }

    const initialTimeout = setTimeout(() => {
      callback()
      startInterval()
    }, initialDelay)

    return () => {
      clearTimeout(initialTimeout)
      if (intervalRef.current) {
        // @ts-ignore
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [callback, delay, initialDelay, dependency])

  return intervalRef
}
