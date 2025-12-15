import { useState, useEffect } from 'react'
import { passwordService, type Password } from '../services/password'
import type { Category } from '../services/category'
import CustomSelect from './CustomSelect'
import Toast from './Toast'

interface PasswordFormProps {
    password: Password | null
    categories: Category[]
    onClose: () => void
    onSuccess?: (message: string) => void
}

export default function PasswordForm({ password, categories, onClose, onSuccess }: PasswordFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        username: '',
        encrypted_password: '',
        website: '',
        notes: '',
        category_id: undefined as number | undefined
    })
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

    useEffect(() => {
        if (password) {
            setFormData({
                title: password.title,
                username: password.username,
                encrypted_password: password.encrypted_password,
                website: password.website || '',
                notes: password.notes || '',
                category_id: password.category_id
            })
        }
    }, [password])

    const selectedCategory = categories.find(c => c.id === formData.category_id)
    const isBanking = selectedCategory?.name?.toLowerCase().includes('banking')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Prepare payload for backend (backend expects 'password', not 'encrypted_password')
            const payload = {
                title: formData.title,
                username: formData.username,
                password: formData.encrypted_password,
                website: formData.website,
                notes: formData.notes,
                category_id: formData.category_id
            }

            if (password?.id) {
                await passwordService.update(password.id, payload as any)
            } else {
                await passwordService.create(payload as any)
            }

            if (onSuccess) {
                onSuccess(password ? 'Password updated successfully' : 'Password created successfully')
            } else {
                onClose()
            }
        } catch (error: any) {
            console.error('Save error:', error)
            let errorMessage = 'Failed to save password'

            if (error.response?.data?.detail) {
                const detail = error.response.data.detail
                if (Array.isArray(detail)) {
                    // Handle Pydantic validation errors
                    errorMessage = detail.map((err: any) => `${err.loc[1]}: ${err.msg}`).join(', ')
                } else {
                    errorMessage = detail
                }
            }

            setToast({ message: errorMessage, type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const handleGenerate = async () => {
        setGenerating(true)
        try {
            const length = isBanking ? 6 : 16
            const includeSymbols = !isBanking

            const generated = isBanking
                ? Math.floor(100000 + Math.random() * 900000).toString()
                : await passwordService.generate(length, includeSymbols)

            setFormData({ ...formData, encrypted_password: generated })
            setShowPassword(true)
        } catch (error) {
            setToast({ message: 'Failed to generate password', type: 'error' })
        } finally {
            setGenerating(false)
        }
    }

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--spacing-lg)',
                    zIndex: 1000
                }}
                onClick={onClose}
            >
                <div
                    className="card card-elevated fade-in"
                    style={{ maxWidth: '500px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div style={{
                        marginBottom: 'var(--spacing-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-md)',
                            background: isBanking ? 'var(--warning)' : 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px'
                        }}>
                            {isBanking ? '🏦' : '🔑'}
                        </div>
                        <h2 style={{ margin: 0 }}>
                            {password ? (isBanking ? 'Edit PIN' : 'Edit Password') : (isBanking ? 'Add PIN' : 'Add Password')}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-col gap-md">
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                                Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder={isBanking ? "e.g., BCA Mobile, Mandiri" : "e.g., Gmail, Facebook"}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                                Username *
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder={isBanking ? "Account Number / User ID" : "email@example.com"}
                                required
                                disabled={loading}
                            />
                        </div>

                        {categories.length > 0 && (
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                                    Category
                                </label>
                                <CustomSelect
                                    options={categories.map(cat => ({
                                        label: cat.name,
                                        value: cat.id,
                                        color: cat.color
                                    }))}
                                    value={formData.category_id}
                                    onChange={(val) => setFormData({ ...formData, category_id: val })}
                                    placeholder="No Category"
                                    disabled={loading}
                                />
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                                {isBanking ? 'PIN *' : 'Password *'}
                            </label>
                            <div className="flex gap-sm">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.encrypted_password}
                                    onChange={(e) => setFormData({ ...formData, encrypted_password: e.target.value })}
                                    placeholder={isBanking ? "Enter 6-digit PIN" : "Enter password"}
                                    required
                                    disabled={loading}
                                    style={{ flex: 1 }}
                                    maxLength={isBanking ? 6 : undefined}
                                    inputMode={isBanking ? 'numeric' : 'text'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="btn-secondary btn-small"
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleGenerate}
                                    className="btn-secondary btn-small"
                                    disabled={generating}
                                    title={isBanking ? "Generate 6-digit PIN" : "Generate secure password"}
                                >
                                    {generating ? '...' : '🎲'}
                                </button>
                            </div>
                            {isBanking && (
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-light)', marginTop: '4px' }}>
                                    For banking, we recommend standard 6-digit PINs
                                </p>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                                Website
                            </label>
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                placeholder="https://example.com"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                                Notes
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Additional notes (optional)"
                                rows={3}
                                disabled={loading}
                            />
                        </div>

                        <div className="flex gap-sm" style={{ marginTop: 'var(--spacing-md)' }}>
                            <button type="submit" disabled={loading} style={{ flex: 1 }}>
                                {loading ? <span className="loading"></span> : (password ? 'Update' : 'Save')}
                            </button>
                            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }} disabled={loading}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
