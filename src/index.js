import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'jotai'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { isLoading } from './style'
import './style.css'

ReactDOM.render(
  <React.StrictMode>
    <Provider>
      <Suspense fallback={<div className={isLoading} />}>
        <App />
      </Suspense>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
