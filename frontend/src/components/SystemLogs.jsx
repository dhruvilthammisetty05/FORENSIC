import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, CheckCircle2, Info, Clock, User, Fingerprint } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function SystemLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/logs');
                setLogs(data);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch logs');
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const getLevelIcon = (level) => {
        switch (level) {
            case 'INFO': return <Info size={18} color="#00f0ff" />;
            case 'WARNING': return <ShieldAlert size={18} color="#ffd700" />;
            case 'CRITICAL': return <ShieldAlert size={18} color="#ff3c3c" />;
            default: return <Activity size={18} />;
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'INFO': return 'rgba(0, 240, 255, 0.1)';
            case 'WARNING': return 'rgba(255, 215, 0, 0.1)';
            case 'CRITICAL': return 'rgba(255, 60, 60, 0.1)';
            default: return 'transparent';
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', color: 'var(--accent-primary)' }}>
                    <Activity size={24} />
                    Terminal Audit Logs
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>Live monitoring of system events and administrative actions.</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Decrypting logs...</div>
            ) : (
                <div className="glass-panel" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>LEVEL</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>TIMESTAMP</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>ACTION</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>USER</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>DETAILS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log, index) => (
                                    <motion.tr
                                        key={log._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.02)',
                                            backgroundColor: getLevelColor(log.level)
                                        }}
                                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                    >
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {getLevelIcon(log.level)}
                                                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{log.level}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Clock size={14} />
                                                {new Date(log.createdAt).toLocaleString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', fontWeight: 500 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Fingerprint size={14} color="var(--accent-primary)" />
                                                {log.action}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <User size={14} />
                                                {log.user ? `${log.user.name} (${log.user.role})` : 'System'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                            {log.details}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                        {logs.length === 0 && (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                No log data recorded yet.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
