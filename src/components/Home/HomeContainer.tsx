import React from 'react'
import { useAppSelector, AppState } from '@/redux/appSlice'
import Home from './Home'

export default function HomeContainer() {
  const accountDetails = useAppSelector((state: AppState) => state.accountDetails)

  return <Home accountDetails={accountDetails} />
}
