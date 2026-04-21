import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Database, Copy, RefreshCw, ExternalLink, CheckCircle2, FileText, Send } from 'lucide-react';
import { generateCourtReport } from '../utils/generatePdf';
import { motion } from 'framer-motion';

export default function EvidenceList() {
    const [evidenceStore, setEvidenceStore] = useState([]);
    const [loading, setLoading] = useState(true);
    const [transferModal, setTransferModal] = useState({ open: false, evidenceId: null, email: '' });

    const fetchEvidence = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/evidence/list');
            setEvidenceStore(data);
        } catch (err) {
            toast.error('Failed to load ledger data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvidence();
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Hash copied to clipboard');
    };

    const tableVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    const handleTransfer = async () => {
        try {
            await api.post(`/evidence/${transferModal.evidenceId}/transfer/initiate`, {
                toEmail: transferModal.email,
                notes: 'Transfer initiated from dashboard'
            });
            toast.success('Transfer request sent to officer.');
            setTransferModal({ open: false, evidenceId: null, email: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Transfer failed');
        }
    };

    return (
        <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Database size={24} color="var(--accent-primary)" />
                    Secured Evidence Registry
                </h3>
                <button className="btn btn-outline" onClick={fetchEvidence} style={{ padding: '6px 12px', fontSize: '12px' }}>
                    <RefreshCw size={14} className={loading ? "spin" : ""} /> Sync Ledger
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <RefreshCw size={24} className="spin" style={{ margin: '0 auto 12px', color: 'var(--accent-primary)' }} />
                        <p>Retrieving blocks from smart contract...</p>
                    </div>
                ) : evidenceStore.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No evidence stored in the contract yet.
                    </div>
                ) : (
                    <motion.table
                        variants={tableVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <thead>
                            <tr>
                                <th>Ev. ID</th>
                                <th>Case Ref</th>
                                <th>Uploader Role</th>
                                <th>Hash Origin (IPFS)</th>
                                <th>Blockchain TX</th>
                                <th>Timestamp</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {evidenceStore.map((ev) => (
                                <motion.tr
                                    key={ev._id}
                                    variants={rowVariants}
                                    whileHover={{ backgroundColor: 'rgba(0, 240, 255, 0.05)' }}
                                    style={{ transition: 'background-color 0.2s' }}
                                >
                                    <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>#{ev.evidenceId}</td>
                                    <td>{ev.caseId}</td>
                                    <td>
                                        <motion.span
                                            className={`badge badge-${ev.role === 'Admin' ? 'danger' : ev.role === 'Investigator' ? 'info' : 'success'}`}
                                            whileHover={{ scale: 1.1 }}
                                            style={{ display: 'inline-block' }}
                                        >
                                            {ev.role}
                                        </motion.span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                                                {ev.ipfsHash.substring(0, 10)}...
                                            </span>
                                            <Copy
                                                size={14}
                                                style={{ cursor: 'pointer', color: 'var(--text-muted)' }}
                                                onClick={() => copyToClipboard(ev.ipfsHash)}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5, type: 'spring' }}
                                            >
                                                <CheckCircle2 size={16} color="var(--accent-success)" />
                                            </motion.div>
                                            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                                                {ev.txHash.substring(0, 12)}...
                                            </span>
                                            <a href={`http://localhost:8545`} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                        {new Date(ev.createdAt).toLocaleString()}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button 
                                                className="btn btn-outline" 
                                                style={{ padding: '4px 8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                onClick={() => generateCourtReport(ev)}
                                            >
                                                <FileText size={14} /> PDF
                                            </button>
                                            <button 
                                                className="btn btn-outline" 
                                                style={{ padding: '4px 8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}
                                                onClick={() => setTransferModal({ open: true, evidenceId: ev.evidenceId, email: '' })}
                                            >
                                                <Send size={14} /> Transfer
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </motion.table>
                )}
            </div>

            {transferModal.open && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                    <div className="glass-panel" style={{ width: '400px' }}>
                        <h3>Transfer Evidence #{transferModal.evidenceId}</h3>
                        <div style={{ margin: '20px 0' }}>
                            <label>Recipient Officer Email</label>
                            <input 
                                type="email" 
                                className="auth-input" 
                                placeholder="officerX@gov.com"
                                value={transferModal.email}
                                onChange={(e) => setTransferModal({ ...transferModal, email: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button className="btn btn-outline" onClick={() => setTransferModal({ open: false, evidenceId: null, email: '' })}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleTransfer}>Send Request</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
