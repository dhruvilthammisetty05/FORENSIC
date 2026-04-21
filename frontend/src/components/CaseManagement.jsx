import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Plus, X, Search, Clock, FileText, User } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CaseManagement() {
    const { user } = useAuth();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/cases');
            setCases(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch cases');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCase = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/cases', formData);
            setCases([data, ...cases]);
            setIsCreating(false);
            setFormData({ title: '', description: '' });
            toast.success('Case created successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create case');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px' }}>
                    <Briefcase color="var(--accent-primary)" />
                    Active Cases
                </h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary"
                    onClick={() => setIsCreating(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={18} />
                    New Case
                </motion.button>
            </div>

            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden', marginBottom: '24px' }}
                    >
                        <form onSubmit={handleCreateCase} className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                            <h3 style={{ marginBottom: '16px', color: 'var(--accent-primary)' }}>Initialize New Case</h3>

                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label style={{ color: 'var(--text-secondary)' }}>Case Title / Identification</label>
                                <input
                                    type="text"
                                    required
                                    className="cyber-input"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Operation Cryptos"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label style={{ color: 'var(--text-secondary)' }}>Case Description</label>
                                <textarea
                                    required
                                    className="cyber-input"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief details about the case parameters..."
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                OPEN CASE FILE
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Scanning databanks...</div>
            ) : cases.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No active cases found in the system.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {cases.map((c, index) => (
                        <motion.div
                            key={c._id || index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-panel card-hover"
                            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 style={{ fontSize: '18px', margin: 0 }}>{c.title}</h3>
                                <span style={{
                                    fontSize: '12px',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    background: c.status === 'Open' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 60, 60, 0.1)',
                                    color: c.status === 'Open' ? '#00ff88' : '#ff3c3c',
                                    fontWeight: 'bold',
                                    border: `1px solid ${c.status === 'Open' ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 60, 60, 0.3)'}`
                                }}>
                                    {c.status}
                                </span>
                            </div>

                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0, flex: 1 }}>
                                {c.description}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: 'auto' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    <Clock size={14} />
                                    Opened: {new Date(c.createdAt).toLocaleDateString()}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    <User size={14} />
                                    Lead: {c.creator?.name || 'Unknown'}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    <FileText size={14} />
                                    Evidence Linked: {c.evidenceList?.length || 0} files
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
