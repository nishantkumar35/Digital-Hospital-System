import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    const getLinkStyle = (path) => {
        const isActive = location.pathname.startsWith(path);
        return {
            color: isActive ? '#3b82f6' : '#94a3b8',
            fontWeight: isActive ? 600 : 500,
            transition: 'color 0.2s',
            textDecoration: 'none'
        };
    };

    return (
        <nav className="glass-panel" style={{
            position: 'sticky',
            top: '1rem',
            zIndex: 100,
            marginBottom: '2rem',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '1rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', background: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>H</div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '-0.5px', color: '#f8fafc' }}>
                    HMS <span style={{ color: '#3b82f6' }}>Core</span>
                </h1>
            </div>

            <ul style={{ display: 'flex', gap: '2rem' }}>
                {['doctors', 'patients', 'medicines', 'receipts'].map((item) => (
                    <li key={item}>
                        <Link to={`/${ item }`} style={getLinkStyle(`/${ item }`)}>
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
