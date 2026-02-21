import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import DashboardOverview from '../components/DashboardOverview';
import UploadEvidence from '../components/UploadEvidence';
import VerifyEvidence from '../components/VerifyEvidence';
import EvidenceList from '../components/EvidenceList';

export default function Dashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const isAdminOrOfficer = user?.role === 'Admin' || user?.role === 'Officer';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>

            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <motion.div
                style={{
                    flex: 1,
                    marginLeft: '80px', // Matches collapsed sidebar width
                    padding: '40px 40px 40px 40px',
                    position: 'relative',
                    transition: 'margin-left 0.3s ease'
                }}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Cyber Grid Background Element */}
                <div className="cyber-grid" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, pointerEvents: 'none',
                    backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: `translateY(${scrolled ? '-10px' : '0px'})`,
                    transition: 'transform 0.5s ease-out'
                }} />

                <header
                    style={{
                        marginBottom: '40px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '32px', textShadow: '0 0 15px rgba(0, 240, 255, 0.3)' }}>
                            COMMAND CENTER
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={16} color="var(--accent-success)" />
                            Immutable Ledger Operations Active
                        </p>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    <motion.main
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        {activeTab === 'dashboard' && <DashboardOverview />}
                        {activeTab === 'upload' && isAdminOrOfficer && <UploadEvidence onSuccess={() => setActiveTab('dashboard')} />}
                        {activeTab === 'verify' && <VerifyEvidence />}
                        {activeTab === 'blockchain' && isAdminOrOfficer && <EvidenceList />}

                        {/* Placeholder Views */}
                        {activeTab === 'cases' && (
                            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                Case Management System (Pending Integration)
                            </div>
                        )}
                        {activeTab === 'logs' && user?.role === 'Admin' && (
                            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                System Logs Viewer (Admin Only)
                            </div>
                        )}
                        {activeTab === 'settings' && user?.role === 'Admin' && (
                            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                System Configuration Panel (Admin Only)
                            </div>
                        )}
                    </motion.main>
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
