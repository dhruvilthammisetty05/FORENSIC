import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Database, LogOut, User } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="logo">
                    <Database className="logo-icon" size={28} />
                    <span>EVIDENCE<span style={{ color: 'var(--text-secondary)', fontWeight: 300 }}>CHAIN</span></span>
                </Link>

                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                            <User size={16} style={{ color: 'var(--accent-primary)' }} />
                            <span>{user.name}</span>
                            <span className={`badge badge-${user.role === 'Admin' ? 'danger' : user.role === 'Investigator' ? 'info' : 'success'}`} style={{ marginLeft: '8px' }}>
                                {user.role}
                            </span>
                        </div>
                        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>
                            <LogOut size={16} /> Disconnect
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
