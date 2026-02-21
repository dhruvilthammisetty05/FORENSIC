import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { ShieldAlert, ShieldCheck, Loader, Search, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TamperAlert = ({ message }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{
                marginTop: '32px',
                padding: '32px 24px',
                borderRadius: '16px',
                border: `2px solid var(--accent-danger)`,
                backgroundColor: 'rgba(255, 0, 60, 0.05)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 0 30px rgba(255, 0, 60, 0.2)'
            }}
        >
            <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1], backgroundPosition: ["0% 0%", "100% 100%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(45deg, transparent 40%, rgba(255,0,60,0.1) 50%, transparent 60%)',
                    backgroundSize: '200% 200%'
                }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <motion.div
                    animate={{ rotate: [0, -15, 15, -15, 15, 0], scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
                >
                    <AlertOctagon size={72} color="var(--accent-danger)" />
                </motion.div>

                <motion.h4
                    animate={{ opacity: [1, 0.7, 1], textShadow: ["0 0 10px #ff003c", "0 0 20px #ff003c", "0 0 10px #ff003c"] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{
                        color: 'var(--accent-danger)',
                        fontSize: '26px',
                        marginTop: '20px',
                        letterSpacing: '2px',
                        fontWeight: '800',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-display)'
                    }}
                >
                    Tamper Detected
                </motion.h4>
                <p style={{ color: 'var(--text-primary)', textAlign: 'center', marginTop: '12px', fontSize: '16px', fontWeight: '500' }}>
                    {message}
                </p>
                <motion.div
                    style={{ marginTop: '24px', width: '0%', height: '2px', background: 'var(--accent-danger)' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />
            </div>
        </motion.div>
    );
};

const SuccessAlert = ({ message }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{
                marginTop: '32px',
                padding: '24px',
                borderRadius: '16px',
                border: `1px solid var(--accent-success)`,
                backgroundColor: 'rgba(0, 255, 102, 0.05)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1], scale: [0.98, 1.05, 0.98] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(0,255,102,0.15) 0%, transparent 70%)',
                    zIndex: 0
                }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                    <ShieldCheck size={48} color="var(--accent-success)" />
                </motion.div>
                <div>
                    <h4 style={{ color: 'var(--accent-success)', fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>
                        INTEGRITY VERIFIED
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {message}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default function VerifyEvidence() {
    const [evidenceId, setEvidenceId] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [result, setResult] = useState(null);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!evidenceId) {
            toast.warning('Evidence ID is required');
            return;
        }

        setVerifying(true);
        setResult(null);

        try {
            const { data } = await api.get(`/evidence/verify/${evidenceId}`);
            setResult(data);
            if (data.status === 'VALID') {
                toast.success('Integrity Check Passed');
            } else {
                toast.error('Evidence Compromised!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed');
            setResult({ status: 'ERROR', message: err.response?.data?.message || 'Verification failed' });
        } finally {
            setVerifying(false);
        }
    };

    return (
        <motion.div
            className="glass-panel"
            style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {verifying && (
                <motion.div
                    initial={{ top: '0%' }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        left: 0, right: 0, height: '4px',
                        background: 'var(--accent-secondary)',
                        boxShadow: '0 0 20px var(--accent-secondary)',
                        zIndex: 50
                    }}
                />
            )}

            <h3 style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px' }}>
                <ShieldAlert size={28} color="var(--accent-secondary)" />
                Verify Chain of Custody
            </h3>

            <form onSubmit={handleVerify}>
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ fontSize: '14px', marginBottom: '10px' }}>Evidence ID Sequence</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                            type="number"
                            required
                            value={evidenceId}
                            onChange={(e) => setEvidenceId(e.target.value)}
                            placeholder="e.g. 101"
                            style={{ flex: 1, padding: '16px', fontSize: '16px' }}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={verifying}
                            style={{ minWidth: '160px', fontSize: '16px' }}
                        >
                            {verifying ? <Loader size={20} className="spin" /> : <><Search size={20} /> INITIATE SCAN</>}
                        </button>
                    </div>
                </div>
            </form>

            <AnimatePresence mode="wait">
                {result && (
                    <motion.div key="result-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {result.status === 'VALID' ? (
                            <SuccessAlert message={result.message} />
                        ) : (
                            <TamperAlert message={result.message} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
