import { useState, useEffect } from 'react'
import { categoryService, type Category } from '../services/category'
import ConfirmModal from './ConfirmModal'

interface CategoryManagerProps {
    onUpdate: () => void // refetch dashboard
}

const COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEEAD', // Yellow
    '#D4A5A5', // Pink
    '#9B59B6', // Purple
    '#3498DB', // Dark Blue
]

export default function CategoryManager({ onUpdate }: CategoryManagerProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [editId, setEditId] = useState<number | null>(null)
    const [formData, setFormData] = useState({ name: '', color: COLORS[0] })
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean
        title: string
        message: string
        action: () => void
    }>({ open: false, title: '', message: '', action: () => { } })

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async () => {
        try {
            const data = await categoryService.getAll()
            setCategories(data)
        } catch (error) {
            console.error('Failed to load categories:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editId) {
                await categoryService.update(editId, formData)
            } else {
                await categoryService.create(formData)
            }
            setIsEditing(false)
            setEditId(null)
            setFormData({ name: '', color: COLORS[0] })
            loadCategories()
            onUpdate()
        } catch (error) {
            console.error('Failed to save category:', error)
            alert('Failed to save category')
        }
    }

    const handleEdit = (category: Category) => {
        setEditId(category.id!)
        setFormData({ name: category.name, color: category.color })
        setIsEditing(true)
    }

    const handleDelete = (id: number) => {
        setConfirmModal({
            open: true,
            title: 'Delete Category',
            message: 'Are you sure? Saved passwords in this category will become uncategorized.',
            action: async () => {
                try {
                    await categoryService.delete(id)
                    loadCategories()
                    onUpdate()
                    setConfirmModal({ ...confirmModal, open: false })
                } catch (error) {
                    console.error('Failed to delete category:', error)
                    alert('Failed to delete category')
                }
            }
        })
    }

    if (loading) return <div className="loading"></div>

    return (
        <div>
            {/* Add/Edit Form */}
            {isEditing ? (
                <div className="card fade-in" style={{ marginBottom: '20px' }}>
                    <h3 style={{ marginBottom: '16px' }}>{editId ? 'Edit Category' : 'New Category'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Category Name"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Color</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {COLORS.map(color => (
                                    <div
                                        key={color}
                                        onClick={() => setFormData({ ...formData, color })}
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: color,
                                            cursor: 'pointer',
                                            border: formData.color === color ? '3px solid var(--text)' : '2px solid transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-sm">
                            <button type="submit" style={{ flex: 1 }}>Save</button>
                            <button
                                type="button"
                                onClick={() => { setIsEditing(false); setEditId(null); }}
                                className="btn-secondary"
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => {
                        setFormData({ name: '', color: COLORS[0] })
                        setIsEditing(true)
                    }}
                    style={{
                        width: '100%',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '16px',
                        background: 'var(--background-alt)',
                        color: 'var(--primary)',
                        border: '2px dashed var(--primary)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer'
                    }}
                >
                    <span style={{ fontSize: '20px' }}>+</span>
                    Add New Category
                </button>
            )}

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {categories.map(category => (
                    <div
                        key={category.id}
                        className="card"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                background: category.color
                            }} />
                            <span style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>{category.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => handleEdit(category)}
                                className="btn-small btn-secondary"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => handleDelete(category.id!)}
                                className="btn-small btn-secondary"
                                style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirm Modal */}
            {confirmModal.open && (
                <ConfirmModal
                    title={confirmModal.title}
                    message={confirmModal.message}
                    onConfirm={confirmModal.action}
                    onCancel={() => setConfirmModal({ ...confirmModal, open: false })}
                    isDangerous={true}
                />
            )}
        </div>
    )
}
