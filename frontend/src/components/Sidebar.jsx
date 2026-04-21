import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    UploadCloud,
    ShieldCheck,
    Database,
    Briefcase,
    FileText,
    Settings,
    ChevronRight,
    ChevronLeft,
    Inbox
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab }) {
    const [isHovered, setIsHovered] = useState(false);
    const { user } = useAuth();

    const isInvestigator = user?.role === 'Investigator';
    const isAdmin = user?.role === 'Admin';
    const isOfficer = user?.role === 'Officer';

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Officer', 'Investigator'] },
        { id: 'upload', label: 'Upload Evidence', icon: UploadCloud, roles: ['Admin', 'Officer'] },
        { id: 'verify', label: 'Verify Evidence', icon: ShieldCheck, roles: ['Admin', 'Officer', 'Investigator'] },
        { id: 'blockchain', label: 'Blockchain Transactions', icon: Database, roles: ['Admin', 'Officer'] },
        { id: 'cases', label: 'Case Management', icon: Briefcase, roles: ['Admin', 'Officer', 'Investigator'] },
        { id: 'inbox', label: 'Custody Inbox', icon: Inbox, roles: ['Admin', 'Officer', 'Investigator'] },
        { id: 'logs', label: 'System Logs', icon: FileText, roles: ['Admin'] },
        { id: 'settings', label: 'Settings', icon: Settings, roles: ['Admin'] },
    ];

    const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role || 'Investigator'));

    return (
        <motion.div
            className="sidebar"
            initial={{ width: 80 }}
            animate={{ width: isHovered ? 260 : 80 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
                height: 'calc(100vh - 72px)', // Assuming navbar is ~72px height
                position: 'fixed',
                left: 0,
                top: '72px',
                background: 'rgba(10, 11, 16, 0.95)',
                borderRight: '1px solid var(--glass-border)',
                backdropFilter: 'blur(20px)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                padding: '24px 0',
                overflowX: 'hidden'
            }}
        >
            <div style={{ padding: '0 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <div style={{
                    minWidth: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Database size={18} color="#fff" />
                </div>
                <motion.span
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px', textShadow: '0 0 10px rgba(0, 240, 255, 0.5)' }}
                >
                    EVIDENCE<span style={{ fontWeight: 300, color: 'var(--text-secondary)' }}>CHAIN</span>
                </motion.span>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 12px' }}>
                {filteredMenu.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <div key={item.id} style={{ position: 'relative' }}>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'rgba(0, 240, 255, 0.15)',
                                        borderRadius: '12px',
                                        borderLeft: '4px solid var(--accent-primary)',
                                        boxShadow: 'inset 0 0 20px rgba(0, 240, 255, 0.05)',
                                        zIndex: 0
                                    }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                            <motion.button
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '12px',
                                    background: 'transparent',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    minHeight: '48px',
                                    width: '100%',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                                whileHover={{ background: isActive ? 'transparent' : 'rgba(255, 255, 255, 0.05)' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '24px' }}>
                                    <Icon size={22} color={isActive ? "var(--accent-primary)" : "var(--text-secondary)"} />
                                </div>
                                <motion.span
                                    animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                                    style={{ fontSize: '15px', fontWeight: isActive ? 600 : 500 }}
                                >
                                    {item.label}
                                </motion.span>
                            </motion.button>
                        </div>
                    )
                })}
            </nav>

            <motion.div
                style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: 'auto' }}
            >
                <div style={{ minWidth: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{user?.name?.charAt(0) || 'U'}</span>
                </div>
                <motion.div animate={{ opacity: isHovered ? 1 : 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{user?.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user?.role}</div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
