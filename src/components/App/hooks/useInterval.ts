import { useEffect, useRef } from 'react'

export function useInterval(callback: () => void, delay: number, dependency: any) {
  const intervalRef = useRef<NodeJS.Timer | null>(null)

  useEffect(() => {
    const interval = setInterval(callback, delay)
    intervalRef.current = interval

    return () => {
      if (intervalRef.current === interval) {
        clearInterval(interval)
        intervalRef.current = null
      }
    }
  }, [callback, delay, dependency])

  return intervalRef
}
