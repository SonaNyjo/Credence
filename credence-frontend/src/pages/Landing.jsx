import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Target, Award, ArrowRight, Info, Users, Code, Cpu } from 'lucide-react';
import ann_img from "../assets/team/ann_img.jpeg";
import su_img from "../assets/team/su_img.jpeg";
import ar_img from "../assets/team/ar_img.jpeg";
import me_img from "../assets/team/me_img.jpeg";
const Landing = () => {

const teamMembers = [
  {
    name: "Ann Maria",
    image: ann_img
  },
  {
    name: "Archana ",
    image: ar_img
  },
  {
    name: "Sona ",
    image: me_img
  },
  {
    name: "Devasoorya",
    image: su_img
  }
];

    return (
        <div className="landing-page" style={{ background: 'var(--bg-dark)', color: 'var(--text-main)', minHeight: '100vh' }}>
            {/* Navigation */}
            <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', padding: '30px 0', alignItems: 'center', zIndex: 10, position: 'relative' }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '2px' }}>CREDENCE</h1>
                </Link>
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <a href="#about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>About</a>
                    <a href="#team" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>Team</a>
                    <Link to="/login" className="btn" style={{ color: 'var(--text-main)', border: '1px solid var(--border)' }}>Login</Link>
                    <Link to="/register" className="btn btn-primary">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section - The Centre of Attraction */}
            <header className="container" style={{ textAlign: 'center', padding: '120px 0', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)', zIndex: 0 }}></div>

                <div className="animate-fade" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '100px', color: 'var(--primary)', fontWeight: 'bold', fontSize: '14px', marginBottom: '30px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                        REVOLUTIONIZING TALENT EVALUATION
                    </div>

                    {/* Animated Letter Dumping for CREDENCE */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                        {"CREDENCE".split("").map((letter, index) => (
                            <motion.span
                                key={index}
                                initial={{ y: -100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    damping: 12,
                                    stiffness: 100,
                                    delay: index * 0.1,
                                    duration: 0.5
                                }}
                                style={{
                                    fontSize: '110px',
                                    fontWeight: '1000',
                                    color: 'var(--primary)',
                                    letterSpacing: '-2px',
                                    lineHeight: '0.9',
                                    display: 'inline-block',
                                    textShadow: '0 0 20px rgba(251, 191, 36, 0.4), 0 0 40px rgba(251, 191, 36, 0.2)'
                                }}
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </div>

                    <h2 style={{ fontSize: '32px', fontWeight: '400', marginBottom: '40px', color: 'var(--text-main)', letterSpacing: '8px' }}>
                        WHERE POTENTIAL MEETS PURPOSE
                    </h2>
                    <p style={{ fontSize: '22px', color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto 50px', lineHeight: '1.6' }}>
                        The world's first reasoning-first assessment platform. We identify genuine human skill by evaluating how you think about systems, not how you write boilerplate.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <Link to="/register" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '18px 40px', fontSize: '20px', borderRadius: '12px' }}>
                            Start Your Journey <ArrowRight size={22} />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Why Credence / About Section */}
            <section id="about" className="container" style={{ padding: '100px 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '48px', marginBottom: '20px' }}>About the Mission</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                        Traditional coding tests are broken. In the era of AI, we focus on the signals that actually matter.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
                    <div className="premium-glass" style={{ padding: '50px' }}>
                        <div style={{ width: '60px', height: '60px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
                            <Cpu color="var(--primary)" size={32} />
                        </div>
                        <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>System Reasoning</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>We don't ask you to write code from scratch. We ask you to explain why a complex system behaves the way it does.</p>
                    </div>
                    <div className="premium-glass" style={{ padding: '50px' }}>
                        <div style={{ width: '60px', height: '60px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
                            <Shield color="var(--primary)" size={32} />
                        </div>
                        <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Native Integrity</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>Our assessments are designed to be AI-resistant by focusing on reasoning chains that LLMs struggle to produce consistently.</p>
                    </div>
                    <div className="premium-glass" style={{ padding: '50px' }}>
                        <div style={{ width: '60px', height: '60px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
                            <Code color="var(--primary)" size={32} />
                        </div>
                        <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Bug Diagnosis</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>Identifying a race condition or a logic flaw in 500 lines of code requires deeper insight than solving an algorithmic puzzle.</p>
                    </div>
                </div>
            </section>

            {/* Meet the Team Section */}
            <section id="team" className="container" style={{ padding: '100px 0', borderTop: '1px solid var(--border)' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '48px', marginBottom: '20px' }}>The Visionary Minds</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                        The incredible team behind the Credence philosophy.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
                    {teamMembers.map((member, index) => (
                        <div key={index} className="premium-glass" style={{ padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--primary)' }}></div>
                           <img
  src={member.image}
  alt={member.name}
  style={{
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '15px'
  }}
/>
                            <h4 style={{ fontSize: '20px' }}>{member.name}</h4>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '60px 0', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: '24px', color: 'var(--primary)', marginBottom: '20px', fontWeight: '900' }}>CREDENCE</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Built for the future of engineering talent.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '40px' }}>
                        <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
                        <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
                        <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Twitter</a>
                        <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>LinkedIn</a>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>&copy; 2026 Credence Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
