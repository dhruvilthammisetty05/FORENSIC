import { useState, useRef } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Upload, FileUp, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadEvidence({ onSuccess }) {
    const [file, setFile] = useState(null);
    const [caseId, setCaseId] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const { user } = useAuth();

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.warning('Please select an evidence file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('caseId', caseId);
        formData.append('role', user.role);

        setUploading(true);
        try {
            const { data } = await api.post('/evidence/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Evidence Secured on Blockchain!');

            // Reset form
            setFile(null);
            setCaseId('');
            if (fileInputRef.current) fileInputRef.current.value = '';

            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <motion.div
            className="glass-panel"
            style={{ maxWidth: '600px', margin: '0 auto' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileUp size={24} color="var(--accent-primary)" />
                Submit New Evidence
            </h3>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                    <label>Case ID Reference</label>
                    <input
                        type="text"
                        required
                        value={caseId}
                        onChange={(e) => setCaseId(e.target.value)}
                        placeholder="e.g. CASE-2023-XYZ"
                    />
                </div>

                <label>Digital Asset (File)</label>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                        borderColor: isDragging ? 'var(--accent-primary)' : 'var(--glass-border)',
                        backgroundColor: isDragging ? 'rgba(0, 240, 255, 0.1)' : 'rgba(0,0,0,0.2)'
                    }}
                    style={{
                        border: '2px dashed var(--glass-border)',
                        borderRadius: '12px',
                        padding: '40px 20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'border-color 0.3s ease, background-color 0.3s ease',
                        marginBottom: '24px'
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <motion.div animate={{ y: isDragging ? -10 : 0 }}>
                        <Upload size={40} color={isDragging ? 'var(--accent-primary)' : 'var(--text-secondary)'} style={{ marginBottom: '12px' }} />
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {file ? (
                            <motion.div key="file" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                                <p style={{ fontWeight: 500, color: 'var(--accent-primary)' }}>{file.name}</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <p style={{ fontWeight: 500 }}>Drag and drop secure file here</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                    or click to browse local storage
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </motion.div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', position: 'relative', overflow: 'hidden' }}
                    disabled={uploading}
                >
                    {uploading && (
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                            style={{
                                position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                zIndex: 1
                            }}
                        />
                    )}
                    <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {uploading ? (
                            <><Loader size={18} className="spin" /> ENCRYPTING AND STORING...</>
                        ) : (
                            <>LOCK EVIDENCE IN LEDGER</>
                        )}
                    </span>
                </button>
            </form>
        </motion.div>
    );
}
