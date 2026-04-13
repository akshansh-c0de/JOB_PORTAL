import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    let user = null;
    try {
        if (userStr && userStr !== "undefined") {
            user = JSON.parse(userStr);
        }
    } catch (error) {
        localStorage.removeItem('user');
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, textDecoration: 'none', color: 'var(--primary)', letterSpacing: '-0.03em' }}>
                    JobPortal<span style={{ color: 'var(--accent)' }}>.</span>
                </Link>
                
                <div className="nav-links">
                    <Link to="/">Explore Jobs</Link>
                    {!token ? (
                        <>
                            <Link to="/login">Sign In</Link>
                            <Link to="/register" className="btn btn-primary" style={{ color: 'white' }}>Get Started</Link>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Welcome, <span style={{ color: 'var(--text-main)' }}>{user?.name || 'User'}</span>
                            </span>
                            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
