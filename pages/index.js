import { Suspense } from 'react'
import { Provider } from 'jotai'
import App from '../components/App'

function Index() {
  return (
    <Provider>
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </Provider>
  )
}

export default Index
