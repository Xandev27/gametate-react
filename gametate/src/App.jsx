import { Route } from 'wouter'
import { Suspense, lazy } from 'react'

const index = lazy(() => import('./pages/index.jsx'))
const login = lazy(() => import('./pages/login.jsx'))
const register = lazy(() => import('./pages/register.jsx'))

export default function App () {
  return (
        <Suspense fallback={null}>
          <Route path='/' component={index} />
          <Route path='/login' component={login} />
          <Route path='/register' component={register} />
        </Suspense>
  )
}
