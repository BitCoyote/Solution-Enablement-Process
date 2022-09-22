import React from 'react'
import { Outlet } from 'react-router'
import ResponsiveAppBar from '../components/appbar/AppBar'

const AppContainer = () => {
  return (
    <>
        <ResponsiveAppBar/>
        <Outlet />
    </>
  )
}

export default AppContainer