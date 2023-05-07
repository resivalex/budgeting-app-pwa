import { useDispatch } from 'react-redux'
import {
  AppState,
  setLastNotificationText as setLastNotificationTextAction,
  useAppSelector,
} from '@/redux/appSlice'

export function useLastNotificationText() {
  const dispatch = useDispatch()
  const lastNotificationText = useAppSelector((state: AppState) => state.lastNotificationText)

  function setLastNotificationText(text: string) {
    dispatch(setLastNotificationTextAction(text))
  }

  return {
    lastNotificationText,
    setLastNotificationText,
  }
}
