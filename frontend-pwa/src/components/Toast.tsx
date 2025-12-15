import { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'info': return 'ℹ️';
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success': return '#D1FAE5'; // Soft green
            case 'error': return '#FEE2E2'; // Soft red
            case 'info': return '#DBEAFE'; // Soft blue
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success': return '#059669';
            case 'error': return '#DC2626';
            case 'info': return '#2563EB';
        }
    };

    const getTextColor = () => {
        switch (type) {
            case 'success': return '#065F46';
            case 'error': return '#991B1B';
            case 'info': return '#1E40AF';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: `translateX(-50%) translateY(${isVisible ? '0' : '-20px'})`,
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
            zIndex: 2000,
            background: getBackgroundColor(),
            border: `1px solid ${getBorderColor()}`,
            color: getTextColor(),
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            maxWidth: '90vw',
            fontWeight: 500
        }}>
            <span style={{ fontSize: '1.2em' }}>{getIcon()}</span>
            <span style={{ flex: 1 }}>{message}</span>
            <button
                onClick={() => setIsVisible(false)}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2em',
                    opacity: 0.5,
                    padding: '0 4px'
                }}
            >
                ×
            </button>
        </div>
    );
}
