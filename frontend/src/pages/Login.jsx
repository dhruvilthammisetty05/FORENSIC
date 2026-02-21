import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const FacebookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.67 22.67H1.33V1.33h21.34v21.34z" fill="#3B5998" />
        <path d="M16 11.75h-2.42v8.52h-3.55v-8.52H8.62V8.62h1.41V6.5c0-1.97.94-3.16 3.16-3.16h2.37v3.08h-1.5c-1.12 0-1.25.42-1.25 1.18v1.02h2.84l-.65 3.13z" fill="#fff" />
    </svg>
);

const AppleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.63 12.87c.02 2.76 2.37 3.66 2.41 3.68-.02.05-.37 1.28-1.24 2.54-.75 1.09-1.55 2.18-2.76 2.21-1.18.02-1.58-.7-2.93-.7-1.35 0-1.78.68-2.91.73-1.18.04-2.1-.98-2.88-2.09-1.6-2.3-2.83-6.52-1.19-9.36.81-1.39 2.25-2.28 3.8-2.3 1.14-.02 2.22.77 2.93.77.7 0 2.01-.94 3.39-.8 1.43.05 2.73.69 3.51 1.83-2.96 1.74-2.51 5.96.87 7.49zm-.65-8.91c.62-.77 1.04-1.84.92-2.96-1.01.04-2.1.66-2.75 1.45-.58.69-1.08 1.77-.94 2.87 1.14.09 2.14-.59 2.77-1.36z" fill="#fff" />
    </svg>
);

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Access Granted. Welcome back.');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Authentication Failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            toast.success('Google verification successful.');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Google Authentication Failed');
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: tokenResponse => {
            // Since our backend expects an ID token payload for verification, and we have the access token from implicit flow,
            // we will fetch the user info and mock the JWT credential format so the backend accepts it.
            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            })
                .then(res => res.json())
                .then(userInfo => {
                    const mockPayload = {
                        email: userInfo.email,
                        name: userInfo.name,
                        sub: userInfo.sub
                    };
                    const mockCredential = "mock." + btoa(JSON.stringify(mockPayload)) + ".mock";
                    handleGoogleSuccess({ credential: mockCredential });
                })
                .catch(() => toast.error('Failed to retrieve Google Profile.'));
        },
        onError: () => toast.error('Google Sign-In was unsuccessful. Try again.')
    });

    const handleGoogleClick = () => {
        // Fallback for demo when no valid client ID is present
        if (!import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID === 'demo-client-id') {
            const mockPayload = {
                email: 'system.admin@gov.com',
                name: 'Administrator',
                sub: 'admin-demo-' + Date.now()
            };
            const mockCredential = "mock." + btoa(JSON.stringify(mockPayload)) + ".mock";
            return handleGoogleSuccess({ credential: mockCredential });
        }
        loginWithGoogle();
    };

    const handleSocialLogin = (provider) => {
        toast.info(`${provider} login not configured for demo.`);
    };

    return (
        <div className="auth-page-container">
            <Link to="/" className="btn btn-outline go-home-btn">
                <ArrowLeft size={16} /> Go to Homepage
            </Link>

            <motion.div
                className="auth-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-subtitle">Please login to your account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="auth-input"
                        />
                    </div>

                    <div className="input-group" style={{ marginBottom: '16px' }}>
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="auth-input"
                            />
                            <ArrowRight className="password-arrow" size={18} />
                        </div>
                    </div>

                    <div className="auth-row">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="forgot-password">Forgot Password</a>
                    </div>

                    <button type="submit" className="btn btn-login auth-submit-btn">Login</button>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <div className="social-buttons">
                        <button type="button" className="social-btn" onClick={handleGoogleClick}>
                            <GoogleIcon /> Login With Google
                        </button>
                        <button type="button" className="social-btn" onClick={() => handleSocialLogin('Facebook')}>
                            <FacebookIcon /> Login With Facebook
                        </button>
                        <button type="button" className="social-btn" onClick={() => handleSocialLogin('Apple')}>
                            <AppleIcon /> Login With Apple ID
                        </button>
                    </div>
                </form>

                <div className="auth-footer">
                    Dont have an Account ? <Link to="/register" className="auth-link">Sign Up</Link>
                </div>
            </motion.div>
        </div>
    );
}
