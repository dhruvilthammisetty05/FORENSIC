import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "demo-client-id"}>
            <AuthProvider>
                <App />
                <ToastContainer position="top-right" autoClose={3000} theme="dark" />
            </AuthProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>,
);
