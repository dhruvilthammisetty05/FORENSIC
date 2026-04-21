import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Inbox, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustodyInbox() {
    const [pendingTransfers, setPendingTransfers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingTransfers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/evidence/pending-transfers/me');
            setPendingTransfers(data);
        } catch (err) {
            toast.error('Failed to load pending custody transfers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingTransfers();
    }, []);

    const handleApprove = async (evidenceId) => {
        try {
            await api.post(`/evidence/${evidenceId}/transfer/approve`);
            toast.success('Custody successfully assumed!');
            fetchPendingTransfers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Approval failed');
        }
    };

    return (
        <div className="glass-panel">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <Inbox size={24} color="var(--accent-secondary)" />
                Pending Custody Hand-offs
            </h3>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Loading...</div>
            ) : pendingTransfers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No pending transfers await your approval.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <AnimatePresence>
                        {pendingTransfers.map((t) => (
                            <motion.div 
                                key={`${t.evidenceId}-${t.initiatedAt}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                    padding: '16px',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Evidence #{t.evidenceId}</h4>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                        Transfer initiated by: <strong style={{ color: 'var(--accent-primary)' }}>{t.fromName}</strong> ({t.fromEmail})
                                    </p>
                                    <p style={{ margin: '0', fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {new Date(t.initiatedAt).toLocaleString()} | Case: {t.caseId}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button 
                                        className="btn btn-outline"
                                        style={{ color: 'var(--accent-danger)', borderColor: 'var(--accent-danger)' }}
                                        onClick={() => toast.info('Transfer manually rejected')}
                                    >
                                        <X size={16} /> Reject
                                    </button>
                                    <button 
                                        className="btn btn-primary"
                                        style={{ background: 'var(--accent-success)', borderColor: 'var(--accent-success)' }}
                                        onClick={() => handleApprove(t.evidenceId)}
                                    >
                                        <Check size={16} /> Cryptographic Sign & Accept
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
