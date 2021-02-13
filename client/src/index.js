import React from 'react'
import ReactDOM from 'react-dom'
import './assets/style/index.sass'
import App from './App'
import reportWebVitals from './reportWebVitals'

import { BrowserRouter } from "react-router-dom"
import Apollo from "./providers/ApolloProvider"
import AuthProvider from "./providers/AuthProvider"

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Apollo>
        <AuthProvider>
          <App/>
        </AuthProvider>
      </Apollo>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
