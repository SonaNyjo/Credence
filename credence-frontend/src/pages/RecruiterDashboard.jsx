import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, BarChart2, Filter } from 'lucide-react';

const RecruiterDashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        // In a real app, this would fetch from /api/users/ranked
        // Mocking for now to show the planned UI
        setCandidates([
            { id: 1, name: "Alice Thompson", score: 850, percentile: 92, reasoning: 8.5, prediction: 9.0 },
            { id: 2, name: "Bob Miller", score: 790, percentile: 85, reasoning: 7.0, prediction: 8.8 },
            { id: 3, name: "Charlie Davis", score: 740, percentile: 78, reasoning: 6.5, prediction: 8.2 },
        ]);
    }, []);

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '32px' }}>Talent Pipeline</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Filtering by system reasoning and bug diagnosis capabilities.</p>
                </div>
                <button onClick={handleLogout} className="btn" style={{ border: '1px solid var(--border)' }}>Logout</button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div className="premium-glass" style={{ padding: '25px' }}>
                    <Users color="var(--primary)" size={32} style={{ marginBottom: '10px' }} />
                    <h3>24 Active</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Candidates in your pool</p>
                </div>
                <div className="premium-glass" style={{ padding: '25px' }}>
                    <BarChart2 color="var(--accent)" size={32} style={{ marginBottom: '10px' }} />
                    <h3>840 Avg</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Top decile Credence score</p>
                </div>
                <div className="premium-glass" style={{ padding: '25px' }}>
                    <Filter color="var(--primary)" size={32} style={{ marginBottom: '10px' }} />
                    <h3>3 Topics</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Active assessment filters</p>
                </div>
            </div>

            <div className="premium-glass" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '15px 25px' }}>Candidate Name</th>
                            <th style={{ textAlign: 'center', padding: '15px' }}>Credence Score</th>
                            <th style={{ textAlign: 'center', padding: '15px' }}>Percentile</th>
                            <th style={{ textAlign: 'center', padding: '15px' }}>Reasoning Depth</th>
                            <th style={{ textAlign: 'center', padding: '15px' }}>Behavior Prediction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map(c => (
                            <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '20px 25px' }}>{c.name}</td>
                                <td style={{ textAlign: 'center', padding: '20px', fontWeight: 'bold' }}>{c.score}</td>
                                <td style={{ textAlign: 'center', padding: '20px' }}>
                                    <span style={{ color: 'var(--primary)', background: 'rgba(251, 191, 36, 0.1)', padding: '4px 10px', borderRadius: '4px' }}>
                                        {c.percentile}th
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center', padding: '20px' }}>{c.reasoning}/10</td>
                                <td style={{ textAlign: 'center', padding: '20px' }}>{c.prediction}/10</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
