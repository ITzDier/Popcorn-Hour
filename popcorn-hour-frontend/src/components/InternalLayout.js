import React from 'react';

const appBgStyle = {
    minHeight: '100vh',
    width: '100vw',
    position: 'relative',
    overflow: 'hidden',
    background: `
        radial-gradient(circle at 20% 30%, #ffb34733 0%, #1a0826 60%),
        linear-gradient(120deg, #6a0572 0%, #1a0826 100%)
    `
};

const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(30,0,60,0.85)',
    backdropFilter: 'blur(8px)',
    zIndex: 0
};

export default function InternalLayout({ children }) {
    return (
        <div style={appBgStyle}>
            <div style={overlayStyle}></div>
            {/* Navbar is NOT included here! It should be added in App.js per your routing structure */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                {children}
            </div>
        </div>
    );
}