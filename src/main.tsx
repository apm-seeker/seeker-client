import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from '@/app'
import { env } from '@/shared/config'
import './index.css'

async function bootstrap() {
  if (env.useMock) {
    const { worker } = await import('@/mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

bootstrap()
