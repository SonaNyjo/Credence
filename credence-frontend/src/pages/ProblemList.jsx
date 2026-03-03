import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, ChevronRight, Lock, CheckCircle } from 'lucide-react';

const ProblemList = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [attempts, setAttempts] = useState({});
    const { logout } = useAuth();

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://127.0.0.1:5000/api/assessments/topic/${topicId}`, {
                    headers: { 'x-auth-token': token }
                });
                setProblems(res.data);

                // Fetch attempts to show progress
                // For now, let's just assume we can fetch attempt status for each problem
                const attemptsData = {};
                for (const p of res.data) {
                    try {
                        const startRes = await axios.post(`http://127.0.0.1:5000/api/attempts/start/${p._id}`, {}, {
                            headers: { 'x-auth-token': token }
                        });
                        attemptsData[p._id] = startRes.data;
                    } catch (e) { }
                }
                setAttempts(attemptsData);
            } catch (err) {
                console.error('Error fetching problems');
            }
        };
        fetchProblems();
    }, [topicId]);

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <Link to="/dashboard" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                    <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} /> Back to Topics
                </Link>
                <button onClick={() => { logout(); navigate('/'); }} className="btn" style={{ border: '1px solid var(--border)' }}>Logout</button>
            </header>

            <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Select a <span style={{ color: 'var(--primary)' }}>Problem</span></h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Each problem contains 4 sequential levels of increasing difficulty.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {problems.map(p => (
                    <div key={p._id} className="premium-glass" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <h3 style={{ marginBottom: '10px' }}>{p.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{p.description}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            {[1, 2, 3, 4].map(num => {
                                const isUnlocked = attempts[p._id]?.levelProgress >= num || (attempts[p._id]?.levelResults?.some(r => r.levelNumber === num && r.status === 'completed'));
                                const isCompleted = attempts[p._id]?.levelResults?.some(r => r.levelNumber === num && r.status === 'completed');

                                return (
                                    <Link
                                        key={num}
                                        to={isUnlocked ? `/assessment/${p._id}/${num}` : '#'}
                                        style={{
                                            flex: 1,
                                            padding: '10px 0',
                                            textAlign: 'center',
                                            background: isCompleted ? 'rgba(16, 185, 129, 0.1)' : (isUnlocked ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.05)'),
                                            border: `1px solid ${isCompleted ? '#10b981' : (isUnlocked ? 'var(--primary)' : 'var(--border)')}`,
                                            borderRadius: '12px',
                                            textDecoration: 'none',
                                            color: isUnlocked ? 'white' : 'var(--text-muted)',
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            minHeight: '60px'
                                        }}
                                    >
                                        <div style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.6 }}>Lvl {num}</div>
                                        {isCompleted ? (
                                            <div style={{ fontWeight: 'bold', color: '#10b981' }}>{Math.round(attempts[p._id]?.levelResults?.find(r => r.levelNumber === num)?.score || 0)}</div>
                                        ) : (
                                            <div style={{ fontWeight: 'bold' }}>{num === 1 ? 'Start' : 'Locked'}</div>
                                        )}
                                        {!isUnlocked && <Lock size={12} style={{ position: 'absolute', top: '5px', right: '5px', opacity: 0.5 }} />}
                                        {isCompleted && <CheckCircle size={10} style={{ position: 'absolute', top: '5px', right: '5px', color: '#10b981' }} />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProblemList;
