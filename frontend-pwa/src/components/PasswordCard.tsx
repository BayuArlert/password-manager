import type { Password } from '../services/password'
import { passwordService } from '../services/password'
import type { Category } from '../services/category'
import { useState } from 'react'
import Toast from './Toast'

interface PasswordCardProps {
    password: Password
    category?: Category
    onEdit: () => void
    onDelete: () => void
}

export default function PasswordCard({ password, category, onEdit, onDelete }: PasswordCardProps) {
    const [showDetails, setShowDetails] = useState(false)
    const [copied, setCopied] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

    const isBanking = category?.name?.toLowerCase().includes('banking')
    const label = isBanking ? 'PIN' : 'Password'

    const handleCopy = async () => {
        try {
            if (!password.id) return

            const decrypted = await passwordService.decrypt(password.id)
            if (decrypted) {
                await navigator.clipboard.writeText(decrypted)
                setCopied(true)
                setToast({ message: `${label} copied to clipboard`, type: 'success' })
                setTimeout(() => setCopied(false), 2000)

                // Auto clear after 30 seconds
                setTimeout(async () => {
                    await navigator.clipboard.writeText('')
                }, 30000)
            } else {
                setToast({ message: 'Failed to decrypt', type: 'error' })
            }
        } catch (error) {
            console.error('Copy error:', error)
            setToast({ message: 'Failed to decrypt password', type: 'error' })
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
            {/* Password Card - Collapsed */}
            <div
                onClick={() => setShowDetails(true)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'white',
                    borderRadius: 'var(--radius-md)',
                    border: '3px solid var(--accent-light)',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-light)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    {/* Category Dot */}
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: category?.color || 'var(--primary)',
                        marginRight: '12px',
                        flexShrink: 0
                    }}></div>

                    {/* Password Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontSize: 'var(--text-md)',
                            fontWeight: 600,
                            color: 'var(--text)',
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {password.title}
                        </div>
                        <div style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-light)',
                            marginBottom: '2px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {password.username}
                        </div>
                        {password.website && (
                            <div style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--primary)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {password.website}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleCopy()
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            padding: '8px'
                        }}
                        title={`Copy ${label}`}
                    >
                        {copied ? '✓' : '📋'}
                    </button>
                    <span style={{ fontSize: '20px', color: 'var(--text-lighter)' }}>›</span>
                </div>
            </div>

            {/* Password Detail Modal */}
            {showDetails && (
                <div
                    onClick={() => setShowDetails(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        zIndex: 1000,
                        animation: 'fadeIn 0.2s ease-out'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            borderTopLeftRadius: 'var(--radius-xl)',
                            borderTopRightRadius: 'var(--radius-xl)',
                            border: '3px solid var(--accent-light)',
                            borderBottom: 'none',
                            maxHeight: '90vh',
                            width: '100%',
                            maxWidth: '600px',
                            display: 'flex',
                            flexDirection: 'column',
                            animation: 'slideUp 0.3s ease-out'
                        }}
                    >
                        {/* Modal Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '20px',
                            borderBottom: '2px solid var(--accent-light)'
                        }}>
                            <h2 style={{
                                fontSize: 'var(--text-xl)',
                                fontWeight: 700,
                                color: 'var(--text)',
                                margin: 0
                            }}>
                                {password.title}
                            </h2>
                            <button
                                onClick={() => setShowDetails(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '28px',
                                    cursor: 'pointer',
                                    padding: '0',
                                    color: 'var(--text)'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{
                            padding: '20px',
                            overflowY: 'auto',
                            flex: 1
                        }}>
                            {/* Username */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 600,
                                    color: 'var(--text-light)',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    Username
                                </div>
                                <div style={{
                                    fontSize: 'var(--text-md)',
                                    color: 'var(--text)'
                                }}>
                                    {password.username}
                                </div>
                            </div>

                            {/* Password/PIN */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 600,
                                    color: 'var(--text-light)',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    {label}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ fontSize: 'var(--text-md)', color: 'var(--text)' }}>
                                        {isBanking ? '••••••' : '•'.repeat(12)}
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                            color: 'var(--primary)'
                                        }}
                                        title={`Copy ${label}`}
                                    >
                                        📋
                                    </button>
                                </div>
                            </div>

                            {/* Website */}
                            {password.website && (
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 600,
                                        color: 'var(--text-light)',
                                        marginBottom: '8px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        Website
                                    </div>
                                    <div style={{
                                        fontSize: 'var(--text-md)',
                                        color: 'var(--text)'
                                    }}>
                                        {password.website}
                                    </div>
                                </div>
                            )}

                            {/* Category */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 600,
                                    color: 'var(--text-light)',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    Category
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: category?.color || 'var(--primary)'
                                    }}></div>
                                    <div style={{
                                        fontSize: 'var(--text-md)',
                                        color: 'var(--text)'
                                    }}>
                                        {category?.name || 'Uncategorized'}
                                    </div>
                                </div>
                            </div>

                            {/* Notes (if any) */}
                            {password.notes && (
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 600,
                                        color: 'var(--text-light)',
                                        marginBottom: '8px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        Notes
                                    </div>
                                    <div style={{
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--text)',
                                        whiteSpace: 'pre-wrap',
                                        background: 'var(--background)',
                                        padding: '12px',
                                        borderRadius: 'var(--radius-sm)'
                                    }}>
                                        {password.notes}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div style={{ padding: '20px', paddingTop: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <button
                                onClick={() => {
                                    setShowDetails(false)
                                    onEdit()
                                }}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: '3px solid var(--primary-dark)',
                                    borderBottomWidth: '6px',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: 'var(--text-md)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span>✏️</span>
                                Edit {label}
                            </button>

                            <button
                                onClick={onDelete}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: 'var(--error)',
                                    color: 'white',
                                    border: '3px solid var(--secondary-dark)',
                                    borderBottomWidth: '6px',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: 'var(--text-md)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span>🗑️</span>
                                Delete {label}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </>
    )
}
