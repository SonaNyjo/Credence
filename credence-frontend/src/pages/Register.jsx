import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'job-seeker' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            if (formData.role === 'recruiter') navigate('/recruiter');
            else navigate('/dashboard');
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.msg || err.response?.data?.error || 'Registration failed. Check connectivity.');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="premium-glass" style={{ padding: '40px', width: '100%', maxWidth: '450px' }}>
                <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Join Credence</h2>
                {error && <p style={{ color: 'var(--error)', marginBottom: '20px' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label>Full Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label>Email</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label>Password</label>
                        <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label>I am a...</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            style={{ padding: '12px', background: 'var(--bg-dark)', color: 'white', borderRadius: '8px', border: '1px solid var(--border)' }}
                        >
                            <option value="job-seeker">Job Seeker</option>
                            <option value="recruiter">Recruiter / Employer</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Create Account</button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
