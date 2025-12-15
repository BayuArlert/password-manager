import { useEffect, useState } from 'react'
import './index.css'
import { authService } from './services/auth'
import Login from './components/Login'
import InitialSetup from './components/InitialSetup'
import Dashboard from './components/Dashboard'

function App() {
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    try {
      setError('')
      const initialized = await authService.checkInitialized()
      setIsInitialized(initialized)

      const hasAuth = authService.isAuthenticated()
      const hasMasterPassword = sessionStorage.getItem('master_password')

      // Force re-login if authenticated but missing master password (needed for encryption)
      if (hasAuth && !hasMasterPassword) {
        authService.logout()
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(hasAuth)
      }
    } catch (error) {
      console.error('Failed to check status:', error)
      setError('Could not connect to server. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleSetupComplete = () => {
    setIsInitialized(true)
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div className="loading"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ color: 'var(--text)', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔌</div>
          <p>{error}</p>
        </div>
        <button onClick={() => { setLoading(true); checkStatus() }}>
          Retry Connection
        </button>
      </div>
    )
  }

  if (isInitialized === false) {
    return <InitialSetup onComplete={handleSetupComplete} />
  }

  if (!isAuthenticated) {
    return <Login onSuccess={handleLoginSuccess} />
  }

  return <Dashboard onLogout={handleLogout} />
}

export default App
