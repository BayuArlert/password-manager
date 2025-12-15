
interface ConfirmModalProps {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    isDangerous?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmModal({
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDangerous = false,
    onConfirm,
    onCancel
}: ConfirmModalProps) {
    return (
        <div
            onClick={onCancel}
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
                zIndex: 2000,
                animation: 'fadeIn 0.2s ease-out'
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="card card-elevated"
                style={{
                    maxWidth: '400px',
                    width: '100%',
                    padding: '24px',
                    animation: 'scaleUp 0.2s ease-out'
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        background: isDangerous ? '#fee2e2' : 'var(--background-alt)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        color: isDangerous ? 'var(--error)' : 'var(--primary)'
                    }}>
                        {isDangerous ? '⚠️' : '❓'}
                    </div>
                    <h3 style={{ margin: 0, color: 'var(--text)' }}>{title}</h3>
                </div>

                <p style={{
                    color: 'var(--text-light)',
                    marginBottom: '24px',
                    lineHeight: '1.5',
                    fontSize: 'var(--text-md)'
                }}>
                    {message}
                </p>

                <div className="flex gap-sm">
                    <button
                        onClick={onCancel}
                        className="btn-secondary"
                        style={{ flex: 1 }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            flex: 1,
                            background: isDangerous ? 'var(--error)' : 'var(--primary)',
                            borderColor: isDangerous ? '#dc2626' : undefined
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes scaleUp {
                    from {
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    )
}
