import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Shield, Mail, Key, Bell, Monitor, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Settings() {
    const { user } = useAuth();

    // Controlled settings
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    const handleSave = () => {
        toast.info("Settings preferences saved locally.");
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', color: 'var(--text-primary)' }}>
                    <SettingsIcon size={24} color="var(--accent-primary)" />
                    System Configuration
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>Manage your personal account profile and application preferences.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>

                {/* Profile Section */}
                <motion.div
                    className="glass-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ padding: '32px' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', margin: 0 }}>
                            <User size={20} /> Identity Profile
                        </h3>
                        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
                            <Edit2 size={14} /> Edit
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Full Name</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <User size={16} color="var(--text-secondary)" />
                                <span>{user?.name || 'Unknown Agent'}</span>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Encrypted Comm Link (Email)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Mail size={16} color="var(--text-secondary)" />
                                <span>{user?.email || 'N/A'}</span>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Security Clearance Level</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Shield size={16} color="var(--accent-primary)" />
                                <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{user?.role || 'Guest'}</span>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Blockchain Auth Key ID</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Key size={16} color="var(--text-secondary)" />
                                <span style={{ fontFamily: 'monospace' }}>***-***-{user?._id?.substring(user._id.length - 4) || 'AUTH'}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* App Settings Section */}
                <motion.div
                    className="glass-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ padding: '32px' }}
                >
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', marginBottom: '24px' }}>
                        <Monitor size={20} /> Client Preferences
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}><Bell size={18} /></div>
                                <div>
                                    <div style={{ fontWeight: 500 }}>System Notifications</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Receive alerts for blockchain verifications and uploads</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                style={{
                                    width: '48px', height: '24px', borderRadius: '12px',
                                    background: notifications ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                    border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s'
                                }}
                            >
                                <motion.div
                                    animate={{ x: notifications ? 24 : 0 }}
                                    style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fff', margin: '2px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                                />
                            </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}><Monitor size={18} /></div>
                                <div>
                                    <div style={{ fontWeight: 500 }}>High-Contrast Dark Mode</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Force dark mode overriding system preferences</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                style={{
                                    width: '48px', height: '24px', borderRadius: '12px',
                                    background: darkMode ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                    border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s'
                                }}
                            >
                                <motion.div
                                    animate={{ x: darkMode ? 24 : 0 }}
                                    style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fff', margin: '2px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                                />
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary"
                        onClick={handleSave}
                    >
                        Save Configuration
                    </motion.button>
                </div>

            </div>
        </div>
    );
}
