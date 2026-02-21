import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldAlert } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Investigator' });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            toast.success('Security Clearance Approved.');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration Failed');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <ShieldAlert size={48} style={{ color: 'var(--accent-secondary)', margin: '0 auto 12px' }} />
                    <h2>REQUEST CLEARANCE</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>Enroll in the Evidence Management System</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label>Full Name</label>
                        <input
                            type="text" name="name" required value={formData.name} onChange={handleChange}
                            placeholder="John Doe"
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label>Email ID</label>
                        <input
                            type="email" name="email" required value={formData.email} onChange={handleChange}
                            placeholder="user@agency.gov"
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label>Access Level (Role)</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="Investigator">Investigator</option>
                            <option value="Officer">First Responding Officer</option>
                            <option value="Admin">System Administrator</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                        <label>Security Key (Password)</label>
                        <input
                            type="password" name="password" required value={formData.password} onChange={handleChange}
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))' }}>SUBMIT REQUEST</button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Already cleared? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Authenticate Here</Link>
                </div>
            </div>
        </div>
    );
}
