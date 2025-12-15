import { useState, useRef, useEffect } from 'react'

interface Option {
    label: string
    value: any
    color?: string
}

interface CustomSelectProps {
    options: Option[]
    value: any
    onChange: (value: any) => void
    placeholder?: string
    disabled?: boolean
}

export default function CustomSelect({ options, value, onChange, placeholder = 'Select option', disabled }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find(opt => opt.value === value)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                opacity: disabled ? 0.6 : 1,
                pointerEvents: disabled ? 'none' : 'auto'
            }}
        >
            {/* Selected Value Display */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '12px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    transition: 'var(--transition)',
                    borderColor: isOpen ? 'var(--primary)' : 'var(--border)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {selectedOption ? (
                        <>
                            {selectedOption.color && (
                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: selectedOption.color
                                }}></div>
                            )}
                            <span style={{ color: 'var(--text)' }}>{selectedOption.label}</span>
                        </>
                    ) : (
                        <span style={{ color: 'var(--text-lighter)' }}>{placeholder}</span>
                    )}
                </div>
                <span style={{ fontSize: '10px', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                    ▼
                </span>
            </div>

            {/* Dropdown Options */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    background: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-md)',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1001,
                    animation: 'fadeIn 0.1s ease-out'
                }}>
                    <div
                        onClick={() => {
                            onChange(undefined)
                            setIsOpen(false)
                        }}
                        style={{
                            padding: '10px 16px',
                            cursor: 'pointer',
                            fontSize: 'var(--text-sm)',
                            color: !value ? 'var(--primary)' : 'var(--text)',
                            background: !value ? 'var(--background-alt)' : 'transparent',
                            borderBottom: '1px solid var(--border)'
                        }}
                    >
                        {placeholder}
                    </div>
                    {options.map(option => (
                        <div
                            key={option.value}
                            onClick={() => {
                                onChange(option.value)
                                setIsOpen(false)
                            }}
                            style={{
                                padding: '10px 16px',
                                cursor: 'pointer',
                                fontSize: 'var(--text-sm)',
                                color: value === option.value ? 'var(--primary)' : 'var(--text)',
                                background: value === option.value ? 'var(--background-alt)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'background 0.1s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = value === option.value ? 'var(--background-alt)' : 'transparent'}
                        >
                            {option.color && (
                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: option.color
                                }}></div>
                            )}
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
