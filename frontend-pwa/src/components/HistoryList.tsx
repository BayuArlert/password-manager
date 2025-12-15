import { useEffect, useState } from 'react'
import { historyService, type ActivityLog } from '../services/history'

export default function HistoryList() {
    const [logs, setLogs] = useState<ActivityLog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadHistory()
    }, [])

    const loadHistory = async () => {
        try {
            const data = await historyService.getAll()
            setLogs(data)
        } catch (error) {
            console.error('Failed to load history:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex-center" style={{ padding: '40px' }}>
                <div className="loading"></div>
            </div>
        )
    }

    if (logs.length === 0) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <h3 style={{ color: 'var(--text)', marginBottom: '8px' }}>No Activity Yet</h3>
                <p style={{ color: 'var(--text-light)', fontSize: 'var(--text-sm)' }}>
                    Your actions will be logged here.
                </p>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {logs.map(log => (
                <div key={log.id} className="card card-hover" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                }}>
                    <div className="flex-between">
                        <span style={{
                            fontWeight: 600,
                            color: 'var(--text)',
                            fontSize: 'var(--text-md)'
                        }}>
                            {log.action}
                        </span>
                        <span style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-light)'
                        }}>
                            {new Date(log.timestamp).toLocaleString()}
                        </span>
                    </div>
                    {log.description && (
                        <div style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-light)'
                        }}>
                            {log.description}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
