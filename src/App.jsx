import React from 'react'
import AppRoute from './routes/AppRoute'
import { BrowserRouter as Router } from 'react-router-dom'

const App = () => {
  return (
    
    <Router>
      <AppRoute/>
    </Router>
    
  )
}

export default App