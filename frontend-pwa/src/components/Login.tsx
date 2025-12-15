import { useState } from 'react'
import { authService } from '../services/auth'
import Logo from './Logo'

interface LoginProps {
    onSuccess: () => void
}

export default function Login({ onSuccess }: LoginProps) {
    const [masterPassword, setMasterPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await authService.login(masterPassword)
            onSuccess()
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid master password')
            setMasterPassword('')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <div className="container-sm fade-in">
                <div className="card card-elevated">
                    {/* Logo Area */}
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                        <div style={{ marginBottom: 'var(--spacing-md)', display: 'inline-block' }}>
                            <Logo size={80} />
                        </div>
                        <h1 style={{ fontSize: 'var(--text-xl)', color: 'var(--text)', marginBottom: '8px' }}>
                            Welcome Back
                        </h1>
                        <p className="text-light" style={{ fontSize: 'var(--text-sm)' }}>
                            Enter your master password
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="flex-col gap-lg">
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: 'var(--spacing-sm)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 500,
                                color: 'var(--text)'
                            }}>
                                Master Password
                            </label>
                            <input
                                type="password"
                                value={masterPassword}
                                onChange={(e) => setMasterPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div style={{
                                padding: 'var(--spacing-md)',
                                background: 'var(--secondary-light)',
                                color: 'var(--text)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: 'var(--text-sm)',
                                border: '1px solid var(--secondary)'
                            }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading} style={{ width: '100%' }}>
                            {loading ? (
                                <>
                                    <span className="loading"></span>
                                    Unlocking...
                                </>
                            ) : (
                                'Unlock'
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p style={{
                    textAlign: 'center',
                    marginTop: 'var(--spacing-md)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-lighter)'
                }}>
                    Protected with AES-256 encryption
                </p>
            </div>
        </div>
    )
}
