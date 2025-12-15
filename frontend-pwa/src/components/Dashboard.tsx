import { useEffect, useState } from 'react'
import { passwordService, type Password } from '../services/password'
import { categoryService, type Category } from '../services/category'
import PasswordCard from './PasswordCard'
import PasswordForm from './PasswordForm'
import ConfirmModal from './ConfirmModal'
import Toast from './Toast'
import CategoryManager from './CategoryManager'
import HistoryList from './HistoryList'

interface DashboardProps {
    onLogout: () => void
}

type View = 'passwords' | 'categories' | 'audit'

export default function Dashboard({ onLogout }: DashboardProps) {
    const [passwords, setPasswords] = useState<Password[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingPassword, setEditingPassword] = useState<Password | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
    const [currentView, setCurrentView] = useState<View>('passwords')
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean
        title: string
        message: string
        action: () => void
        isDangerous?: boolean
    }>({ open: false, title: '', message: '', action: () => { } })
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [passwordsData, categoriesData] = await Promise.all([
                passwordService.getAll(),
                categoryService.getAll()
            ])
            setPasswords(passwordsData)
            setCategories(categoriesData)
        } catch (error) {
            console.error('Failed to load data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddPassword = () => {
        setEditingPassword(null)
        setShowForm(true)
    }

    const handleEditPassword = (password: Password) => {
        setEditingPassword(password)
        setShowForm(true)
    }

    const handleDeletePassword = (id: number) => {
        setConfirmModal({
            open: true,
            title: 'Delete Password',
            message: 'Are you sure you want to delete this password? This action cannot be undone.',
            isDangerous: true,
            action: () => processDeletePassword(id)
        })
    }

    const processDeletePassword = async (id: number) => {
        try {
            await passwordService.delete(id)
            setPasswords(passwords.filter(p => p.id !== id))
            setConfirmModal({ ...confirmModal, open: false })
            setToast({ message: 'Password deleted successfully', type: 'success' })
        } catch (error) {
            console.error('Failed to delete password:', error)
            setConfirmModal({ ...confirmModal, open: false })
            setToast({ message: 'Failed to delete password', type: 'error' })
        }
    }

    const handleFormSuccess = (message: string) => {
        setToast({ message, type: 'success' })
        setShowForm(false)
        setEditingPassword(null)
        loadData()
    }

    const handleFormClose = () => {
        setShowForm(false)
        setEditingPassword(null)
        loadData()
    }

    const filteredPasswords = passwords.filter(password => {
        const matchesSearch = password.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            password.username?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === null || password.category_id === selectedCategory
        return matchesSearch && matchesCategory
    })

    // ... existing code ...

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--background)' }}>
                <div className="loading"></div>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--background)',
            paddingBottom: '80px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{
                background: 'white',
                padding: '20px',
                paddingTop: '40px',
                borderBottom: '3px solid var(--accent-light)',
                boxShadow: 'var(--shadow-sm)'
            }}>
                {/* Top Header */}
                <div className="flex-between" style={{ marginBottom: '20px' }}>
                    <h1 style={{
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 700,
                        color: 'var(--text)',
                        margin: 0
                    }}>
                        My Vault
                    </h1>
                    <button
                        onClick={onLogout}
                        className="btn-small"
                        style={{
                            background: 'var(--secondary)',
                            borderColor: 'var(--secondary)',
                            color: 'white'
                        }}
                    >
                        🔒 Lock
                    </button>
                </div>

                {/* Search Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--background-alt)',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--border)',
                    padding: '12px 16px'
                }}>
                    <span style={{ fontSize: '18px', marginRight: '12px' }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search passwords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            flex: 1,
                            color: 'var(--text)',
                            fontSize: 'var(--text-sm)',
                            padding: 0
                        }}
                    />
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
                {currentView === 'passwords' && (
                    <>
                        {/* Category Filter */}
                        {categories.length > 0 && (
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                marginBottom: '16px',
                                overflowX: 'auto',
                                paddingBottom: '8px'
                            }}>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    style={{
                                        fontSize: 'var(--text-xs)',
                                        padding: '6px 12px',
                                        background: selectedCategory === null ? 'var(--primary)' : 'white',
                                        color: selectedCategory === null ? 'white' : 'var(--text-light)',
                                        border: '2px solid var(--border)',
                                        borderRadius: 'var(--radius-sm)',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    All
                                </button>
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id!)}
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            padding: '6px 12px',
                                            background: selectedCategory === category.id ? category.color : 'white',
                                            color: selectedCategory === category.id ? 'white' : 'var(--text-light)',
                                            border: `2px solid ${selectedCategory === category.id ? category.color : 'var(--border)'}`,
                                            borderRadius: 'var(--radius-sm)',
                                            whiteSpace: 'nowrap',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: selectedCategory === category.id ? 'white' : category.color
                                        }}></div>
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Password List */}
                        {filteredPasswords.length === 0 ? (
                            <div className="card" style={{
                                textAlign: 'center',
                                padding: '60px 20px',
                                marginTop: '40px'
                            }}>
                                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔑</div>
                                <p style={{
                                    color: 'var(--text-light)',
                                    fontSize: 'var(--text-lg)',
                                    fontWeight: 600,
                                    marginBottom: '8px'
                                }}>
                                    {passwords.length === 0 ? 'No passwords yet' : 'No passwords match your search'}
                                </p>
                                <p style={{ color: 'var(--text-lighter)', fontSize: 'var(--text-sm)' }}>
                                    {passwords.length === 0 ? 'Tap + to add your first password' : 'Try a different search term'}
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {filteredPasswords.map(password => (
                                    <PasswordCard
                                        key={password.id}
                                        password={password}
                                        category={categories.find(c => c.id === password.category_id)}
                                        onEdit={() => handleEditPassword(password)}
                                        onDelete={() => handleDeletePassword(password.id!)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {currentView === 'categories' && (
                    <div style={{ paddingBottom: '20px' }}>
                        <h2 style={{ marginBottom: '20px', paddingLeft: '4px' }}>Manage Categories</h2>
                        <CategoryManager onUpdate={loadData} />
                    </div>
                )}

                {currentView === 'audit' && (
                    <div style={{ paddingBottom: '20px' }}>
                        <h2 style={{ marginBottom: '20px', paddingLeft: '4px' }}>Activity History</h2>
                        <HistoryList />
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'white',
                borderTop: '3px solid var(--accent-light)',
                boxShadow: '0 -2px 12px rgba(180, 199, 231, 0.1)',
                display: 'flex',
                padding: '12px 0',
                zIndex: 100
            }}>
                <button
                    onClick={() => setCurrentView('passwords')}
                    style={{
                        flex: 1,
                        border: 'none',
                        borderTop: currentView === 'passwords' ? '3px solid var(--primary)' : '3px solid transparent',
                        background: currentView === 'passwords' ? 'var(--background-alt)' : 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '8px',
                        cursor: 'pointer',
                        color: currentView === 'passwords' ? 'var(--primary)' : 'var(--text-lighter)',
                        transition: 'all 0.2s',
                    }}
                >
                    <span style={{ fontSize: '24px' }}>🏠</span>
                    <span style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: currentView === 'passwords' ? 600 : 400
                    }}>
                        Passwords
                    </span>
                </button>

                <button
                    onClick={() => setCurrentView('categories')}
                    style={{
                        flex: 1,
                        border: 'none',
                        borderTop: currentView === 'categories' ? '3px solid var(--primary)' : '3px solid transparent',
                        background: currentView === 'categories' ? 'var(--background-alt)' : 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '8px',
                        cursor: 'pointer',
                        color: currentView === 'categories' ? 'var(--primary)' : 'var(--text-lighter)',
                        transition: 'all 0.2s',
                    }}
                >
                    <span style={{ fontSize: '24px' }}>📁</span>
                    <span style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: currentView === 'categories' ? 600 : 400
                    }}>
                        Categories
                    </span>
                </button>

                <button
                    onClick={() => setCurrentView('audit')}
                    style={{
                        flex: 1,
                        border: 'none',
                        borderTop: currentView === 'audit' ? '3px solid var(--primary)' : '3px solid transparent',
                        background: currentView === 'audit' ? 'var(--background-alt)' : 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '8px',
                        cursor: 'pointer',
                        color: currentView === 'audit' ? 'var(--primary)' : 'var(--text-lighter)',
                        transition: 'all 0.2s',
                    }}
                >
                    <span style={{ fontSize: '24px' }}>⏱️</span>
                    <span style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: currentView === 'audit' ? 600 : 400
                    }}>
                        History
                    </span>
                </button>
            </div>

            {/* Floating Add Button */}
            {currentView === 'passwords' && (
                <button
                    onClick={handleAddPassword}
                    style={{
                        position: 'fixed',
                        right: '20px',
                        bottom: '100px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '30px',
                        background: 'var(--secondary)',
                        border: '3px solid var(--secondary-dark)',
                        borderBottomWidth: '6px',
                        boxShadow: '0 4px 16px rgba(244, 194, 194, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        color: 'white',
                        cursor: 'pointer',
                        zIndex: 99,
                        transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    +
                </button>
            )}

            {/* Password Form Modal */}
            {showForm && (
                <PasswordForm
                    password={editingPassword}
                    categories={categories}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                />
            )}

            {/* Confirmation Modal */}
            {confirmModal.open && (
                <ConfirmModal
                    title={confirmModal.title}
                    message={confirmModal.message}
                    isDangerous={confirmModal.isDangerous}
                    onConfirm={confirmModal.action}
                    onCancel={() => setConfirmModal({ ...confirmModal, open: false })}
                    confirmText="Delete"
                />
            )}

            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    )
}
