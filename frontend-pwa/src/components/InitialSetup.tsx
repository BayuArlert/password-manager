import { useState } from 'react'
import { authService } from '../services/auth'
import Logo from './Logo'

interface InitialSetupProps {
    onComplete: () => void
}

export default function InitialSetup({ onComplete }: InitialSetupProps) {
    const [masterPassword, setMasterPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (masterPassword.length < 8) {
            setError('Master password must be at least 8 characters')
            return
        }

        if (masterPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        try {
            await authService.initialize(masterPassword)
            onComplete()
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'Failed to initialize'
            if (errorMessage === 'Master password already set') {
                onComplete()
                return
            }
            setError(errorMessage)
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
                            Setup Password Manager
                        </h1>
                        <p className="text-light" style={{ fontSize: 'var(--text-sm)' }}>
                            Create your master password
                        </p>
                    </div>

                    {/* Setup Form */}
                    <form onSubmit={handleSubmit} className="flex-col gap-md">
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
                                placeholder="At least 8 characters"
                                required
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: 'var(--spacing-sm)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 500,
                                color: 'var(--text)'
                            }}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter password"
                                required
                                disabled={loading}
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

                        <button type="submit" disabled={loading} style={{ width: '100%', marginTop: 'var(--spacing-md)' }}>
                            {loading ? (
                                <>
                                    <span className="loading"></span>
                                    Setting up...
                                </>
                            ) : (
                                'Create Password'
                            )}
                        </button>

                        {/* Warning */}
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'var(--accent-light)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--accent)',
                            marginTop: 'var(--spacing-sm)'
                        }}>
                            <p style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text)',
                                lineHeight: 1.5
                            }}>
                                ⚠️ Remember this password - it cannot be recovered!
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
