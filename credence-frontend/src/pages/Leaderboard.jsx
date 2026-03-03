import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, Award, User } from 'lucide-react';

const Leaderboard = () => {
    const [rankings, setRankings] = useState([]);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://127.0.0.1:5000/api/auth/leaderboard', {
                    headers: { 'x-auth-token': token }
                });
                setRankings(res.data);
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '32px' }}>Student <span style={{ color: 'var(--primary)' }}>Leaderboard</span></h2>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => navigate('/dashboard')} className="btn" style={{ border: '1px solid var(--border)' }}>Dashboard</button>
                    <button onClick={() => { logout(); navigate('/'); }} className="btn" style={{ border: '1px solid var(--border)' }}>Logout</button>
                </div>
            </header>

            <div className="premium-glass" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '15px 25px' }}>Rank</th>
                            <th style={{ textAlign: 'left', padding: '15px' }}>Student Name</th>
                            <th style={{ textAlign: 'center', padding: '15px' }}>Credence Score</th>
                            <th style={{ textAlign: 'center', padding: '15px' }}>Consistency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings.map((r, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i < 3 ? 'rgba(251, 191, 36, 0.03)' : 'transparent' }}>
                                <td style={{ padding: '20px 25px', fontWeight: 'bold' }}>
                                    {i === 0 && <Trophy size={18} color="var(--primary)" style={{ marginRight: '10px' }} />}
                                    #{i + 1}
                                </td>
                                <td style={{ padding: '20px' }}>{r.name}</td>
                                <td style={{ textAlign: 'center', padding: '20px', fontWeight: 'bold', color: 'var(--accent)' }}>{r.score}</td>
                                <td style={{ textAlign: 'center', padding: '20px' }}>
                                    <span style={{ padding: '4px 10px', background: 'var(--bg-dark)', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '12px' }}>
                                        {r.consistency}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
