import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Database, ShieldAlert, ShieldCheck, Activity, Server, Clock, Briefcase, FileText, UploadCloud } from 'lucide-react';

const CountUpCard = ({ title, value, icon: Icon, colorClass, highlight = false }) => (
    <motion.div
        className="glass-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        style={{
            padding: '24px',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            border: highlight ? '1px solid var(--accent-danger)' : '1px solid var(--glass-border)',
            boxShadow: highlight ? '0 0 20px rgba(255,0,60,0.15)' : 'none'
        }}
    >
        {highlight && (
            <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(255,0,60,0.1) 0%, transparent 60%)'
                }}
            />
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>{title}</div>
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-display)', color: `var(--${colorClass})` }}
                >
                    {value}
                </motion.div>
            </div>
            <div style={{ padding: '12px', background: `rgba(var(--${colorClass}-rgb), 0.1)`, borderRadius: '12px' }}>
                <Icon size={24} color={`var(--${colorClass})`} />
            </div>
        </div>
    </motion.div>
);

export default function DashboardOverview() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEvidence: 0,
        verifiedEvidence: 0,
        tamperedAlerts: 0,
        recentActivity: []
    });

    const isAdmin = user?.role === 'Admin';
    const isOfficer = user?.role === 'Officer';
    const isInvestigator = user?.role === 'Investigator';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/evidence/stats');
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                {isAdmin && (
                    <>
                        <CountUpCard title="System Alerts" value={stats.tamperedAlerts} icon={ShieldAlert} colorClass="accent-danger" highlight={stats.tamperedAlerts > 0} />
                        <CountUpCard title="Blockchain TXs" value={stats.totalEvidence * 2} icon={Activity} colorClass="accent-info" />
                        <CountUpCard title="Total Evidence" value={stats.totalEvidence} icon={Database} colorClass="accent-primary" />
                        <CountUpCard title="Active Nodes" value={3} icon={Server} colorClass="accent-success" />
                    </>
                )}

                {isOfficer && (
                    <>
                        <CountUpCard title="My Uploads" value={stats.totalEvidence} icon={UploadCloud} colorClass="accent-primary" />
                        <CountUpCard title="Verified Evidence" value={stats.verifiedEvidence} icon={ShieldCheck} colorClass="accent-success" />
                        <CountUpCard title="Pending TXs" value={0} icon={Activity} colorClass="accent-info" />
                        <CountUpCard title="Active Cases" value={4} icon={Briefcase} colorClass="accent-primary" />
                    </>
                )}

                {isInvestigator && (
                    <>
                        <CountUpCard title="Assigned Cases" value={7} icon={Briefcase} colorClass="accent-info" />
                        <CountUpCard title="Evidence to Verify" value={stats.totalEvidence} icon={Database} colorClass="accent-primary" />
                        <CountUpCard title="Verified Valid" value={stats.verifiedEvidence} icon={ShieldCheck} colorClass="accent-success" />
                        <CountUpCard title="Tampered Alerts" value={stats.tamperedAlerts} icon={ShieldAlert} colorClass="accent-danger" highlight={stats.tamperedAlerts > 0} />
                    </>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isInvestigator ? '1fr' : '2fr 1fr', gap: '24px' }}>
                <motion.div className="glass-panel" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={20} color="var(--accent-primary)" />
                        Evidence Activity Timeline
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {stats.recentActivity.length === 0 ? (
                            <div style={{ color: 'var(--text-secondary)' }}>No recent activity found.</div>
                        ) : stats.recentActivity.map((ev, idx) => (
                            <motion.div
                                key={ev._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                style={{
                                    padding: '16px',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: '12px',
                                    borderLeft: '4px solid var(--accent-primary)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '15px' }}>Evidence #{ev.evidenceId} Uploaded</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Case: {ev.caseId} • By {ev.role}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(ev.createdAt).toLocaleString()}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--accent-info)', fontFamily: 'monospace', marginTop: '4px' }}>TX: {ev.txHash.substring(0, 10)}...</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {!isInvestigator && (
                    <motion.div className="glass-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Server size={20} color="var(--accent-success)" />
                            Blockchain Network
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-success)', boxShadow: '0 0 10px var(--accent-success)' }} />
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Ganache Localnet</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Status: Connected & Synchronized</div>
                                </div>
                            </div>

                            <div style={{ padding: '16px', background: 'rgba(0, 255, 102, 0.05)', borderRadius: '12px', border: '1px solid rgba(0,255,102,0.1)' }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Latest Block</div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-success)', fontFamily: 'var(--font-display)' }}>
                                    #{8429 + stats.totalEvidence /* mock incremental block counter */}
                                </div>
                            </div>

                            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Est. Network Gas</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                    3,000,000 wei
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
