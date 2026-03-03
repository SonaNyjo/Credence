import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout, ClipboardList, TrendingUp, User, Cpu, Server, Layers, Layout as LayoutIcon, ChevronRight, Trophy, AlertTriangle } from 'lucide-react';

const SeekerDashboard = () => {
    const [topics, setTopics] = useState([]);
    const [stats, setStats] = useState({ rank: 0, credenceScore: 0, levelsCleared: 0, reasoningScore: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'Cpu': return <Cpu size={32} color="var(--primary)" />;
            case 'Server': return <Server size={32} color="var(--primary)" />;
            case 'Layers': return <Layers size={32} color="var(--primary)" />;
            case 'Layout': return <LayoutIcon size={32} color="var(--primary)" />;
            default: return <ClipboardList size={32} color="var(--primary)" />;
        }
    };

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://127.0.0.1:5000/api/assessments/topics', {
                    headers: { 'x-auth-token': token }
                });
                setTopics(res.data);
            } catch (err) {
                console.error('Error fetching topics:', err);
                setError(err.response?.data?.msg || err.message || 'Could not connect to assessment server.');
            } finally {
                setLoading(false);
            }
        };

        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://127.0.0.1:5000/api/auth/stats', {
                    headers: { 'x-auth-token': token }
                });
                setStats(res.data);
            } catch (err) {
                console.error('Error fetching stats:', err);
                // We don't set the main error here because we want topics to show even if stats fail
            }
        };

        setLoading(true);
        fetchTopics();
        fetchStats();
    }, []);

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '32px' }}>Welcome, <span style={{ color: 'var(--primary)' }}>{user?.name}</span></h2>
                    <p style={{ color: 'var(--text-muted)' }}>Select a topic to start proving your system reasoning.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => navigate('/leaderboard')} className="btn" style={{ border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Trophy size={18} /> Leaderboard
                    </button>
                    <button onClick={handleLogout} className="btn" style={{ border: '1px solid var(--border)' }}>Logout</button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="premium-glass" style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={40} />
                        </div>
                        <h4>Global Rank</h4>
                        <h2 style={{ fontSize: '36px', color: 'var(--accent)' }}>#{stats.rank || '--'}</h2>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Score: {stats.credenceScore}</p>
                    </div>

                    <div className="premium-glass" style={{ padding: '20px' }}>
                        <h4 style={{ marginBottom: '15px' }}>Summary</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <TrendingUp size={20} color="var(--accent)" />
                            <span>{stats.reasoningScore}% Reasoning Score</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <ClipboardList size={20} color="var(--primary)" />
                            <span>{stats.levelsCleared} Levels Cleared</span>
                        </div>
                    </div>
                </aside>

                <section>
                    <h3 style={{ marginBottom: '20px' }}>Available Topics</h3>

                    {loading && <div className="premium-glass" style={{ padding: '40px', textAlign: 'center' }}>Loading topics...</div>}

                    {error && (
                        <div className="premium-glass" style={{ padding: '40px', textAlign: 'center', border: '1px solid var(--error)' }}>
                            <AlertTriangle color="var(--error)" size={48} style={{ marginBottom: '20px' }} />
                            <h4 style={{ color: 'var(--error)', marginBottom: '10px' }}>Failed to Load Topics</h4>
                            <p style={{ color: 'var(--text-muted)' }}>{error}</p>
                            <button onClick={() => window.location.reload()} className="btn" style={{ marginTop: '20px', border: '1px solid var(--border)' }}>Retry</button>
                        </div>
                    )}

                    {!loading && !error && topics.length === 0 && (
                        <div className="premium-glass" style={{ padding: '40px', textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-muted)' }}>No topics found. Please contact an administrator.</p>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                        {!loading && !error && topics.map(t => (
                            <div key={t._id} className="premium-glass" style={{ padding: '30px', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => navigate(`/topic/${t._id}`)}>
                                <div style={{ marginBottom: '20px' }}>{getIcon(t.icon)}</div>
                                <h4 style={{ fontSize: '22px', marginBottom: '10px' }}>{t.name}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>{t.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--primary)' }}>4 Problems Available</span>
                                    <ChevronRight size={20} color="var(--primary)" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SeekerDashboard;
