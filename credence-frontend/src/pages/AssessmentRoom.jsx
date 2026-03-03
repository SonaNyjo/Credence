import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Timer, AlertTriangle, Lightbulb, ChevronRight, CheckCircle, Info, Camera, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AssessmentRoom = () => {
    const { problemId, levelNumber } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [attempt, setAttempt] = useState(null);
    const [phase, setPhase] = useState('instruction'); // instruction, analysis, mcq
    const [explanation, setExplanation] = useState('');
    const [mcqIndex, setMcqIndex] = useState(0);
    const [mcqResponses, setMcqResponses] = useState([]);
    const [timer, setTimer] = useState(120);
    const [integrity, setIntegrity] = useState({ tabSwitches: 0 });
    const [showHint, setShowHint] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const timerRef = useRef(null);
    const videoRef = useRef(null);

    // Camera setup
    useEffect(() => {
        const setupCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (err) {
                console.warn('Camera access denied');
            }
        };
        setupCamera();
    }, []);

    // Initial Fetch
    useEffect(() => {
        const initialize = async () => {
            try {
                const token = localStorage.getItem('token');
                const [res, startRes] = await Promise.all([
                    axios.get(`http://127.0.0.1:5000/api/assessments/${problemId}/level/${levelNumber}`, {
                        headers: { 'x-auth-token': token }
                    }),
                    axios.post(`http://127.0.0.1:5000/api/attempts/start/${problemId}`, {}, {
                        headers: { 'x-auth-token': token }
                    })
                ]);
                setData(res.data);
                setAttempt(startRes.data);
            } catch (err) {
                setError('Failed to initialize assessment. ' + (err.response?.data?.msg || ''));
            }
        };
        initialize();

        const handleVisibility = () => {
            if (document.hidden) {
                setIntegrity(prev => ({ ...prev, tabSwitches: prev.tabSwitches + 1 }));
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [problemId, levelNumber]);

    // MCQ Timer
    useEffect(() => {
        if (phase === 'mcq' && timer > 0) {
            timerRef.current = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0 && phase === 'mcq') {
            submitAssessment();
        }
        return () => clearInterval(timerRef.current);
    }, [phase, timer]);

    const handleExplanationSubmit = () => {
        if (!explanation.trim()) return alert('Please provide your reasoning.');
        setPhase('mcq');
        setTimer(120); // 2 minutes for MCQs
    };

    const handleMcqSelect = (optionIndex) => {
        const newResponses = [...mcqResponses];
        newResponses[mcqIndex] = { questionIndex: mcqIndex, selectedOption: optionIndex };
        setMcqResponses(newResponses);

        if (mcqIndex < data.levelDetails.mcqs.length - 1) {
            setMcqIndex(mcqIndex + 1);
        } else {
            submitAssessment(newResponses);
        }
    };

    const submitAssessment = async (finalMcqResponses = mcqResponses) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://127.0.0.1:5000/api/attempts/${problemId}/submit-level`, {
                levelNumber: parseInt(levelNumber),
                explanation,
                mcqResponses: finalMcqResponses
            }, { headers: { 'x-auth-token': token } });

            navigate(`/topic/${data.topicId || ''}`); // Redirect back to problem list
            alert(`Level ${levelNumber} submitted successfully!`);
        } catch (err) {
            alert('Submission failed. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (error) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}><h2>{error}</h2><button onClick={() => navigate('/dashboard')} className="btn btn-primary">Dashboard</button></div>;
    if (!data) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Initializing Proctored Session...</div>;

    const { levelDetails } = data;

    return (
        <div className="container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '20px' }}>
            {/* Header */}
            <header className="premium-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ padding: '5px 12px', background: 'var(--primary)', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Level {levelNumber}</div>
                    <strong>{data.title}</strong>
                </div>
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    {phase === 'mcq' && <div style={{ color: 'var(--error)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><Timer size={20} /> {timer}s</div>}
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={18} /> Switches: {integrity.tabSwitches}</div>
                    <div className="camera-preview" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#000', overflow: 'hidden', border: '1px solid var(--primary)' }}>
                        <video ref={videoRef} autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>
            </header>

            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                    {/* Phase 1: Instruction Screen */}
                    {phase === 'instruction' && (
                        <motion.div
                            key="instruction"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="premium-glass"
                            style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px' }}
                        >
                            <Info size={64} color="var(--primary)" style={{ marginBottom: '30px' }} />
                            <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Important Instructions</h2>
                            <div style={{ maxWidth: '600px', fontSize: '18px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '40px' }}>
                                <p>You are not required to write or fix code.</p>
                                <p>Your task is to:</p>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li>• Understand how the system behaves</li>
                                    <li>• Identify the root cause of incorrect behavior</li>
                                    <li>• Explain <strong>why</strong> this behavior occurs</li>
                                </ul>
                                <p style={{ color: 'var(--primary)', marginTop: '20px' }}>Focus on reasoning, not syntax.</p>
                            </div>
                            <button onClick={() => setPhase('analysis')} className="btn btn-primary" style={{ padding: '15px 60px', fontSize: '18px' }}>I Understand, Start Analysis</button>
                        </motion.div>
                    )}

                    {/* Phase 2: Analysis (Code + Explanation) */}
                    {phase === 'analysis' && (
                        <motion.div
                            key="analysis"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr 1.5fr', gap: '20px', height: '100%' }}
                        >
                            {/* Persistent Instructions */}
                            <div className="premium-glass" style={{ padding: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '15px' }}>
                                    <Info size={18} /> <strong>Mission</strong>
                                </div>
                                <p style={{ marginBottom: '15px' }}>You are not required to write/fix code.</p>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <li>• Understand system behavior</li>
                                    <li>• Identify root causes</li>
                                    <li>• Explain failure scenarios</li>
                                </ul>
                                <p style={{ color: 'var(--primary)', marginTop: '20px', fontWeight: 'bold' }}>Reasoning over Syntax.</p>
                            </div>
                            <div className="premium-glass" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <div style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}><Lock size={12} style={{ marginRight: '5px' }} /> Locked Program</span>
                                    {levelDetails.hint && (
                                        <button onClick={() => setShowHint(true)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
                                            <Lightbulb size={14} /> Need a hint?
                                        </button>
                                    )}
                                </div>
                                <pre style={{ flex: 1, padding: '25px', overflow: 'auto', fontSize: '15px', color: '#e0e0e0', userSelect: 'none', WebkitUserSelect: 'none' }} onCopy={e => e.preventDefault()} onContextMenu={e => e.preventDefault()}>
                                    <code>{data.programCode}</code>
                                </pre>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className="premium-glass" style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>{levelDetails.explanationQuestion}</h3>
                                    <textarea
                                        style={{ flex: 1, width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '15px', color: 'white', resize: 'none', fontSize: '16px', lineHeight: '1.6' }}
                                        placeholder="What is the issue? Why does it happen? Under what scenario does it fail?"
                                        value={explanation}
                                        onChange={e => setExplanation(e.target.value)}
                                    />
                                    <button onClick={handleExplanationSubmit} className="btn btn-primary" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        Next: MCQ Round <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {showHint && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="premium-glass" style={{ position: 'absolute', bottom: '20px', left: '25px', padding: '15px 25px', background: 'rgba(251, 191, 36, 0.95)', color: 'black', border: 'none' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                            <strong style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Lightbulb size={16} /> Hint</strong>
                                            <button onClick={() => setShowHint(false)} style={{ background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>×</button>
                                        </div>
                                        <p>{levelDetails.hint}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Phase 3: MCQs */}
                    {phase === 'mcq' && (
                        <motion.div
                            key="mcq"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
                        >
                            <div className="premium-glass" style={{ padding: '50px', width: '100%', maxWidth: '700px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Question {mcqIndex + 1} of 10</span>
                                    <span style={{ color: 'var(--primary)' }}>Reasoning Check</span>
                                </div>
                                <h2 style={{ fontSize: '28px', marginBottom: '40px', lineHeight: '1.4' }}>{levelDetails.mcqs[mcqIndex].question}</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {levelDetails.mcqs[mcqIndex].options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleMcqSelect(i)}
                                            className="btn"
                                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', textAlign: 'left', padding: '20px', color: 'white', fontSize: '16px', transition: 'all 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                                        >
                                            <span style={{ color: 'var(--primary)', marginRight: '15px', fontWeight: 'bold' }}>{String.fromCharCode(65 + i)}</span>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                <div style={{ marginTop: '40px', height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                    <div style={{ height: '100%', width: `${((mcqIndex + 1) / 10) * 100}%`, background: 'var(--primary)', borderRadius: '2px', transition: 'width 0.3s' }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Sticky Instruction Reminder */}
            {phase !== 'instruction' && (
                <div style={{ position: 'fixed', bottom: '20px', right: '20px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }}>
                    PROCTORED SESSION • CAMERA ACTIVE • TAB MONITORING ON
                </div>
            )}
        </div>
    );
};

export default AssessmentRoom;
